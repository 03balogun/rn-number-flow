import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Reanimated, {
  LinearTransition,
  ReduceMotion,
} from 'react-native-reanimated';
import AnimatedCounter from 'rn-number-flow';

const intNumber = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function App() {
  const [value, setValue] = useState<number>(10234485);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [mountNewCounter, setMountNewCounter] = useState(false);

  return (
    <View style={styles.container}>
      <Reanimated.View
        layout={LinearTransition}
        style={styles.animatedContainer}
      >
        {/* Default animation (animate on mount) */}
        <Text>Default animation (with mount):</Text>
        <AnimatedCounter
          value={intNumber.format(value)}
          style={styles.font42}
          separatorStyle={styles.separatorGreen}
          animationConfig={{
            enabled: animationsEnabled,
            animateOnMount: true,
          }}
        />

        {/* Fast animation (no mount animation) */}
        <Text>Fast animation (no mount):</Text>
        <AnimatedCounter
          value={intNumber.format(value)}
          style={styles.font32}
          separatorStyle={styles.separatorBlue}
          animationConfig={{
            animateOnMount: false,
            enabled: true,
            mass: 0.5,
            stiffness: 200,
            damping: 50,
            digitDelay: 10,
          }}
        />

        {/* Slow animation */}
        <Text>Slow animation (with mount):</Text>
        <AnimatedCounter
          value={intNumber.format(value)}
          style={styles.font24}
          separatorStyle={styles.separatorRed}
          animationConfig={{
            enabled: animationsEnabled,
            animateOnMount: true,
            mass: 1,
            stiffness: 50,
            damping: 20,
            digitDelay: 30,
            reduceMotion: ReduceMotion.Never,
          }}
        />

        <AnimatedCounter
          value={intNumber.format(value)}
          style={styles.font20}
          separatorStyle={styles.separatorRed}
          animationConfig={{
            enabled: animationsEnabled,
            animateOnMount: true,
            mass: 1,
            stiffness: 50,
            damping: 20,
            digitDelay: 30,
            reduceMotion: ReduceMotion.Never,
          }}
        />

        {/* Remountable counter to test mount animations */}
        {mountNewCounter && (
          <>
            <Text>Newly mounted counter:</Text>
            <AnimatedCounter
              value={intNumber.format(value)}
              style={styles.font20}
              separatorStyle={styles.separatorPurple}
              animationConfig={{
                enabled: animationsEnabled,
                animateOnMount: true,
                digitDelay: 40,
              }}
            />
          </>
        )}
      </Reanimated.View>

      <View style={styles.buttonContainer}>
        <Button
          title="Random Number"
          onPress={() => setValue(Math.floor(Math.random() * 10000000) / 100)}
        />
        <Button
          title={animationsEnabled ? 'Disable Animations' : 'Enable Animations'}
          onPress={() => setAnimationsEnabled(!animationsEnabled)}
        />
        <Button
          title={mountNewCounter ? 'Remove Counter' : 'Add Counter'}
          onPress={() => setMountNewCounter(!mountNewCounter)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: { alignItems: 'center', gap: 16 },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  font42: { fontSize: 42, fontWeight: 'bold' },
  font32: { fontSize: 32, fontWeight: 'bold' },
  font24: { fontSize: 24 },
  font20: { fontSize: 20 },
  separatorGreen: { opacity: 0.5 },
  separatorBlue: { color: '#3498db' },
  separatorRed: { color: '#e74c3c' },
  separatorPurple: { color: '#9b59b6' },
});
