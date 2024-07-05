import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const BOX_SIZE = 300;

// Predefined path data for the letter "S"
const predefinedPathData = `
  M150,100
  C100,100,100,200,150,200
  C200,200,200,300,150,300
`;

// Predefined path as an array of points for comparison (start and end points)
const predefinedPath = [
  { x: 150, y: 100 },
  { x: 100, y: 200 },
  { x: 150, y: 200 },
  { x: 200, y: 300 },
  { x: 150, y: 300 },
];

const TracingComponent = () => {
  const [pathData, setPathData] = useState('');
  const [userPath, setUserPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState(null);

  const handleGesture = event => {
    const { absoluteX, absoluteY } = event.nativeEvent;
    if (isDrawing && isInsideBox(absoluteX, absoluteY)) {
      const newPoint = {
        x: absoluteX - (width - BOX_SIZE) / 2,
        y: absoluteY - (height - BOX_SIZE) / 2,
      };
      console.log(`User Point: (${newPoint.x}, ${newPoint.y})`); // Log the user's point coordinates
      setUserPath(prevPath => [...prevPath, newPoint]);
      setPathData(prevPath => `${prevPath} L${newPoint.x},${newPoint.y}`);
    }
  };

  const handleStateChange = event => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;

    if (state === State.BEGAN && isInsideBox(absoluteX, absoluteY)) {
      const startPoint = {
        x: absoluteX - (width - BOX_SIZE) / 2,
        y: absoluteY - (height - BOX_SIZE) / 2,
      };
      setUserPath([startPoint]);
      setPathData(`M${startPoint.x},${startPoint.y}`);
      setIsDrawing(true);
      console.log('Drawing started');
    } else if (state === State.END) {
      setIsDrawing(false);
      checkPathMatch();
      console.log('Drawing ended');
    }
  };

  const isInsideBox = (x, y) => {
    const boxLeft = (width - BOX_SIZE) / 2;
    const boxRight = boxLeft + BOX_SIZE;
    const boxTop = (height - BOX_SIZE) / 2;
    const boxBottom = boxTop + BOX_SIZE;

    return x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom;
  };

  const checkPathMatch = () => {
    const threshold = 200; // Tolerance for matching points
    let match = true;

    if (userPath.length < predefinedPath.length) {
      setResult('Try again, not enough points.');
      return;
    }

    for (let i = 0; i < predefinedPath.length; i++) {
      const predefinedPoint = predefinedPath[i];
      const userPoint = userPath[i];

      console.log(`Expected Point: (${predefinedPoint.x}, ${predefinedPoint.y})`); // Log the expected point coordinates

      const distance = Math.sqrt(
        Math.pow(predefinedPoint.x - userPoint.x, 2) +
        Math.pow(predefinedPoint.y - userPoint.y, 2)
      );

      if (distance > threshold) {
        match = false;
        break;
      }
    }

    setResult(match ? 'Success! You traced the path correctly.' : 'Try again, path did not match.');
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleStateChange}
      >
        <View style={styles.gestureContainer}>
          <View style={styles.box}>
            <Svg height={BOX_SIZE} width={BOX_SIZE} style={styles.svg}>
              {/* Add background rectangle */}
              <Rect width={BOX_SIZE} height={BOX_SIZE} fill="lightyellow" />
              {/* Draw the predefined path for letter "S" */}
              <Path
                d={predefinedPathData}
                stroke="gray"
                strokeWidth={20} // Increased width of the stroke
                fill="none"
                strokeOpacity={0.5} // 50% transparency
              />
              {/* Draw the user's path */}
              <Path
                d={pathData}
                stroke="black"
                strokeWidth={4}
                fill="none" // No fill for the user's path
                strokeOpacity={1} // Full opacity for user's drawing
              />
            </Svg>
          </View>
          {!isDrawing && <Text style={styles.instructionText}>Draw inside the box</Text>}
          {result && <Text style={styles.resultText}>{result}</Text>}
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  instructionText: {
    position: 'absolute',
    top: 50,
    fontSize: 18,
    color: 'gray',
  },
  resultText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 18,
    color: 'blue',
  },
});

export default TracingComponent;
