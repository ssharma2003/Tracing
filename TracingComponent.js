import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const BOX_SIZE = 300;

const TracingComponent = () => {
  const [pathData, setPathData] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const handleGesture = (event) => {
    const { absoluteX, absoluteY } = event.nativeEvent;
    if (isDrawing && isInsideBox(absoluteX, absoluteY)) {
      setPathData(prevPath => `${prevPath} L${absoluteX - (width - BOX_SIZE) / 2},${absoluteY - (height - BOX_SIZE) / 2}`);
    }
  };

  const handleStateChange = (event) => {
    const { state, absoluteX, absoluteY } = event.nativeEvent;

    if (state === State.BEGAN && isInsideBox(absoluteX, absoluteY)) {
      setPathData(`M${absoluteX - (width - BOX_SIZE) / 2},${absoluteY - (height - BOX_SIZE) / 2}`);
      setIsDrawing(true);
      console.log('Drawing started');
    } else if (state === State.END) {
      setIsDrawing(false);
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

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleStateChange}
      >
        <View style={styles.gestureContainer}>
          <View style={styles.box}>
            <Svg height={BOX_SIZE} width={BOX_SIZE} style={styles.svg}>
              <Path
                d={pathData}
                stroke="black"
                strokeWidth="4"
                fill="none"
              />
            </Svg>
          </View>
          {!isDrawing && <Text style={styles.instructionText}>Draw inside the box</Text>}
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
});

export default TracingComponent;
