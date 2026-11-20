import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Svg, {
  Line,
  Path,
} from 'react-native-svg';

type Props = {
  bpm?: number | null;
  isConnected: boolean;
  hasValidReading?: boolean;
  width?: number;
  height?: number;
};

const TRACK_WIDTH = 640;
const TRACK_SHIFT = 320;

const LiveHeartWave: React.FC<Props> = ({
  bpm,
  isConnected,
  hasValidReading = true,
  width = 280,
  height = 82,
}) => {
  const translateX = useRef(
    new Animated.Value(0),
  ).current;

  const animationRef =
    useRef<Animated.CompositeAnimation | null>(
      null,
    );

  const validBpm =
    typeof bpm === 'number' &&
    Number.isFinite(bpm) &&
    bpm > 0 &&
    bpm <= 250;

  const shouldAnimate =
    isConnected &&
    hasValidReading &&
    validBpm;

  const safeBpm = validBpm
    ? Math.min(
        Math.max(
          Math.round(bpm as number),
          40,
        ),
        180,
      )
    : 0;

  /*
   * BPM ko speed bands me divide kiya hai.
   *
   * Har chhote BPM fluctuation par animation
   * restart nahi hogi. Speed sirf meaningful
   * BPM range change hone par update hogi.
   */
  const animationDuration = useMemo(() => {
    if (safeBpm <= 0) {
      return 3000;
    }

    if (safeBpm < 60) {
      return 3400;
    }

    if (safeBpm < 90) {
      return 2700;
    }

    if (safeBpm < 120) {
      return 2200;
    }

    if (safeBpm < 150) {
      return 1800;
    }

    return 1500;
  }, [safeBpm]);

  useEffect(() => {
    animationRef.current?.stop();
    animationRef.current = null;

    translateX.stopAnimation();
    translateX.setValue(0);

    if (!shouldAnimate) {
      return;
    }

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -TRACK_SHIFT,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animationRef.current = animation;
    animation.start();

    return () => {
      animation.stop();

      if (
        animationRef.current ===
        animation
      ) {
        animationRef.current = null;
      }
    };
  }, [
    animationDuration,
    shouldAnimate,
    translateX,
  ]);

  /*
   * First 320px ECG section.
   * Second identical section below starts at
   * 320px, making the movement continuous.
   */
  const pulsePath = `
    M 0 42
    L 18 42
    L 24 39
    L 30 42
    L 42 42
    L 49 34
    L 56 51
    L 63 42
    L 78 42
    L 88 39
    L 94 42
    L 112 42
    L 119 38
    L 126 42
    L 139 42
    L 145 31
    L 151 54
    L 158 42
    L 175 42
    L 183 39
    L 190 42
    L 206 42
    L 215 38
    L 221 42
    L 235 42
    L 242 27
    L 249 59
    L 256 42
    L 275 42
    L 284 39
    L 292 42
    L 320 42
  `;

  const repeatedPulsePath = `
    ${pulsePath}

    M 320 42
    L 338 42
    L 344 39
    L 350 42
    L 362 42
    L 369 34
    L 376 51
    L 383 42
    L 398 42
    L 408 39
    L 414 42
    L 432 42
    L 439 38
    L 446 42
    L 459 42
    L 465 31
    L 471 54
    L 478 42
    L 495 42
    L 503 39
    L 510 42
    L 526 42
    L 535 38
    L 541 42
    L 555 42
    L 562 27
    L 569 59
    L 576 42
    L 595 42
    L 604 39
    L 612 42
    L 640 42
  `;

  function renderGrid() {
    const lines: React.ReactNode[] = [];

    for (
      let x = 0;
      x <= width;
      x += 20
    ) {
      lines.push(
        <Line
          key={`vertical-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />,
      );
    }

    for (
      let y = 0;
      y <= height;
      y += 20
    ) {
      lines.push(
        <Line
          key={`horizontal-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />,
      );
    }

    return lines;
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
      ]}>
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}>
        {renderGrid()}
      </Svg>

      {!shouldAnimate ? (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}>
          <Path
            d={`M 0 ${height / 2} L ${width} ${height / 2}`}
            stroke="rgba(255,255,255,0.75)"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      ) : (
        <View style={styles.waveClip}>
          <Animated.View
            style={{
              width: TRACK_WIDTH,
              height,
              transform: [
                {
                  translateX,
                },
              ],
            }}>
            <Svg
              width={TRACK_WIDTH}
              height={height}>
              <Path
                d={repeatedPulsePath}
                stroke="rgba(255,255,255,0.94)"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Animated.View>
        </View>
      )}

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            shouldAnimate
              ? styles.liveDot
              : styles.offlineDot,
          ]}
        />

        <Text style={styles.statusText}>
          {shouldAnimate
            ? 'LIVE'
            : 'OFFLINE'}
        </Text>
      </View>

      <View style={styles.bpmArea}>
        <Text style={styles.bpmValue}>
          {shouldAnimate
            ? safeBpm
            : '--'}
        </Text>

        <Text style={styles.bpmUnit}>
          BPM
        </Text>
      </View>
    </View>
  );
};

export default LiveHeartWave;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
  },

  waveClip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  statusRow: {
    position: 'absolute',
    left: 4,
    bottom: 0,
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.20)',
    backgroundColor:
      'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  liveDot: {
    backgroundColor: '#26C281',
  },

  offlineDot: {
    backgroundColor: '#B8BDC8',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  bpmArea: {
    position: 'absolute',
    right: 3,
    bottom: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  bpmValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  bpmUnit: {
    color:
      'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
});