import {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ComponentProps,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  type TextStyle,
  type TextLayoutLine,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
} from 'react-native';
import Reanimated, {
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

interface AnimationConfig {
  /** Enable or disable animations (default: true) */
  enabled?: boolean;
  /** Enable or disable animation on initial mount (default: true) */
  animateOnMount?: boolean;
  /** Delay between each digit animation in ms (default: 20) */
  digitDelay?: number;
  /** Spring animation mass (default: 0.8) */
  mass?: number;
  /** Spring animation stiffness (default: 75) */
  stiffness?: number;
  /** Spring animation damping (default: 15) */
  damping?: number;
  /** Enable/disable reduce motion (default: System) */
  reduceMotion?: ReduceMotion;
}

interface NumberFlowProps {
  /** The value to be displayed */
  value: string;
  /** Style for the entire counter */
  style?: TextStyle;
  /** Style specifically for non-numeric characters (like commas, currency symbols) */
  separatorStyle?: TextStyle;
  /** Animation configuration */
  animationConfig?: AnimationConfig;
  /** Enable/disable text auto-fitting based on ascender (default: false) */
  autoFitText?: boolean;
}

const DIGITS = [...Array(10).keys()];

const Character = memo(
  ({ children, style, ...rest }: ComponentProps<typeof Text>) => {
    const charStyle = typeof style === 'object' ? style : {};

    return (
      <Text
        style={[
          charStyle,
          {
            fontVariant: ['tabular-nums'],
          },
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  }
);

const CharacterList = memo(
  ({
    number,
    index,
    style,
    animationConfig,
    initialRender,
  }: {
    number: number;
    index: number;
    style?: TextStyle;
    animationConfig: Required<
      Omit<AnimationConfig, 'digitDelay' | 'animateOnMount'>
    >;
    initialRender: boolean;
  }) => {
    const lineHeight = Math.round(Number(style?.lineHeight || 0));
    const { mass, stiffness, damping, reduceMotion } = animationConfig;

    const targetPosition = -lineHeight * number;

    const animateStyle = useAnimatedStyle(() => {
      'worklet';
      if (initialRender) {
        return {
          transform: [{ translateY: Math.round(targetPosition) }],
        };
      }

      return {
        transform: [
          {
            translateY: withDelay(
              index,
              withSpring(targetPosition, {
                mass,
                stiffness,
                damping,
                reduceMotion,
                restSpeedThreshold: 0.01,
                restDisplacementThreshold: 0.01,
              }),
              reduceMotion
            ),
          },
        ],
      };
    }, [
      number,
      index,
      lineHeight,
      mass,
      stiffness,
      damping,
      reduceMotion,
      initialRender,
      targetPosition,
    ]);

    return (
      <View style={[styles.characterList, { height: lineHeight }]}>
        <Reanimated.View style={animateStyle}>
          {DIGITS.map((digit, digitIndex) => (
            <Character
              key={`${digit}-${digitIndex}`}
              style={{
                ...style,
                lineHeight,
                height: lineHeight,
              }}
            >
              {digit}
            </Character>
          ))}
        </Reanimated.View>
      </View>
    );
  }
);

export const NumberFlow = memo(
  ({
    value,
    style,
    separatorStyle,
    animationConfig = {},
    autoFitText = false,
  }: NumberFlowProps) => {
    const [textLayout, setTextLayout] = useState<TextLayoutLine>();
    const [isMounted, setIsMounted] = useState(false);

    const {
      enabled = true,
      animateOnMount = true,
      digitDelay = 20,
      mass = 0.8,
      stiffness = 75,
      damping = 15,
      reduceMotion = ReduceMotion.System,
    } = animationConfig;

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }, []);

    const shouldAnimate = enabled && (isMounted ? true : animateOnMount);
    const isInitialRender = !animateOnMount && !isMounted;

    const fontSize = useMemo(() => {
      if (autoFitText && textLayout?.ascender) {
        return Math.round(textLayout.ascender);
      }

      return Math.round(Number(style?.fontSize || 16));
    }, [autoFitText, textLayout?.ascender, style?.fontSize]);

    const lineHeight = useMemo(() => {
      return Math.round(fontSize * 1.2);
    }, [fontSize]);

    const charStyle = useMemo(() => {
      return {
        ...style,
        fontSize,
        lineHeight,
        height: lineHeight,
      };
    }, [fontSize, lineHeight, style]);

    const separatorCharStyle = useMemo(() => {
      return {
        ...charStyle,
        ...separatorStyle,
      };
    }, [charStyle, separatorStyle]);

    const accessibleValue = useMemo(() => {
      return `Current value is ${value}`;
    }, [value]);

    const splitValue = useMemo(() => {
      return value.split('');
    }, [value]);

    const handleTextLayout = useCallback(
      (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (autoFitText) {
          setTextLayout(e.nativeEvent.lines[0]);
        }
      },
      [autoFitText]
    );

    return (
      <>
        {autoFitText && (
          <Character
            aria-hidden
            onTextLayout={handleTextLayout}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.hiddenCounter, style]}
          >
            {value}
          </Character>
        )}
        <View
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={accessibleValue}
          accessibilityHint={accessibleValue}
          accessibilityLiveRegion="polite"
          style={styles.counterContainer}
        >
          {splitValue.map((char, index) => {
            if (!isNaN(Number(char))) {
              return shouldAnimate ? (
                <CharacterList
                  style={charStyle}
                  index={index * digitDelay}
                  key={index}
                  number={parseInt(char, 10)}
                  animationConfig={{
                    enabled,
                    mass,
                    stiffness,
                    damping,
                    reduceMotion,
                  }}
                  initialRender={isInitialRender}
                />
              ) : (
                <Reanimated.View layout={LinearTransition} key={index}>
                  <Character style={charStyle}>{char}</Character>
                </Reanimated.View>
              );
            }

            return (
              <Character key={index} style={separatorCharStyle}>
                {char}
              </Character>
            );
          })}
        </View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hiddenCounter: {
    position: 'absolute',
    opacity: 0,
    color: 'red',
  },
  characterList: {
    overflow: 'hidden',
  },
});
