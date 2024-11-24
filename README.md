# React Native Number Flow 🔢

[![npm version](https://badge.fury.io/js/rn-number-flow.svg)](https://badge.fury.io/js/rn-number-flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Platform - Android and iOS](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue.svg)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/)

A beautiful, high-performance animated number transition component for React Native. Perfect for displaying counters, prices, statistics, and any numeric values with style! 💫

## Demo 🎥

  <img src='https://github.com/user-attachments/assets/71bf7f32-1900-497f-9a4a-b7240db75a4a' width="400" style="max-width: 100%;" />
  

## Features ✨

- 🚀 Smooth, fluid animations powered by React Native Reanimated
- 🎨 Highly customizable styles and animations
- 📱 Cross-platform support (iOS & Android)
- 🔧 Easy to configure animation parameters
- ⚡️ Optimized performance
- 🎯 TypeScript support
- 📦 Zero dependencies (except for React Native Reanimated)

## Installation 📦

```bash
# Using npm
npm install rn-number-flow

# Using yarn
yarn add rn-number-flow
```

Make sure you have [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) installed and configured in your project.

## Usage 💻

```jsx
import NumberFlow from 'rn-number-flow';

// Basic usage
<NumberFlow value="1234" />

// With custom styling
<NumberFlow
  value="1234.56"
  style={{ fontSize: 24, color: '#007AFF' }}
  separatorStyle={{ color: '#666' }}
/>

// With custom animation config
<NumberFlow
  value="9999"
  animationConfig={{
    enabled: true,
    animateOnMount: true,
    digitDelay: 50,
    mass: 0.8,
    stiffness: 75,
    damping: 15
  }}
/>
```

## Props 📝

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | - | The numeric value to display |
| `style` | TextStyle | - | Style for the digits |
| `separatorStyle` | TextStyle | - | Style for non-numeric characters (like commas, decimals) |
| `autoFitText` | boolean | false | Enable/disable text auto-fitting based on ascender |
| `animationConfig` | AnimationConfig | - | Configuration for animations |

### AnimationConfig Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | true | Enable/disable animations |
| `animateOnMount` | boolean | true | Animate on initial render |
| `digitDelay` | number | 20 | Delay between digit animations (ms) |
| `mass` | number | 0.8 | Spring animation mass |
| `stiffness` | number | 75 | Spring animation stiffness |
| `damping` | number | 15 | Spring animation damping |
| `reduceMotion` | ReduceMotion | System | Respect system's reduce motion settings |

## Examples 🎯

### Basic Counter
```jsx
import NumberFlow from 'rn-number-flow';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <NumberFlow value={count.toString()} />
      <Button title="Increment" onPress={() => setCount(c => c + 1)} />
    </View>
  );
}
```

### Price Display
```jsx
<NumberFlow
  value="$1,234.99"
  style={{ fontSize: 32, fontWeight: 'bold' }}
  separatorStyle={{ color: '#666' }}
  animationConfig={{ digitDelay: 50 }}
/>
```

## Contributing 🤝

Contributions are welcome! Feel free to open issues and submit PRs.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

MIT 

---

Made with ❤️ for the React Native community.
