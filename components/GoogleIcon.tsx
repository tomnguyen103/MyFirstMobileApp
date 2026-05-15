import { View, StyleSheet } from "react-native";

interface Props {
  size?: number;
}

/**
 * Google "G" logo built with plain React Native Views — no SVG or image assets.
 *
 * Construction:
 *  1. Four coloured quadrant sections form the outer circle.
 *  2. A white inner circle punches a hole → creates the ring / doughnut.
 *  3. A white rectangle on the right removes part of the ring → opens the G.
 *  4. A blue rectangle sits at the vertical centre → the G's crossbar.
 */
export default function GoogleIcon({ size = 20 }: Props) {
  const half = size / 2;
  const ring = size * 0.24;       // ring thickness
  const inner = half - ring;      // inner-hole radius
  const gapW = ring + 2;          // width of the right-side opening
  const gapH = ring * 1.8;        // height of the opening
  const barH = ring * 0.88;       // crossbar height (slightly less than ring)
  const barW = half + ring * 0.1; // crossbar width — center → right edge

  return (
    <View style={{ width: size, height: size }}>
      {/* ── Red  (top-left) ── */}
      <View style={[st.q, { top: 0, left: 0, width: half, height: half }]}>
        <View
          style={[st.c, {
            width: size, height: size,
            borderRadius: half,
            backgroundColor: "#EA4335",
            top: 0, left: 0,
          }]}
        />
      </View>

      {/* ── Blue  (top-right) ── */}
      <View style={[st.q, { top: 0, right: 0, width: half, height: half }]}>
        <View
          style={[st.c, {
            width: size, height: size,
            borderRadius: half,
            backgroundColor: "#4285F4",
            top: 0, right: 0,
          }]}
        />
      </View>

      {/* ── Yellow  (bottom-left) ── */}
      <View style={[st.q, { bottom: 0, left: 0, width: half, height: half }]}>
        <View
          style={[st.c, {
            width: size, height: size,
            borderRadius: half,
            backgroundColor: "#FBBC05",
            bottom: 0, left: 0,
          }]}
        />
      </View>

      {/* ── Green  (bottom-right) ── */}
      <View style={[st.q, { bottom: 0, right: 0, width: half, height: half }]}>
        <View
          style={[st.c, {
            width: size, height: size,
            borderRadius: half,
            backgroundColor: "#34A853",
            bottom: 0, right: 0,
          }]}
        />
      </View>

      {/* ── White inner circle → doughnut / ring ── */}
      <View
        style={{
          position: "absolute",
          width: inner * 2,
          height: inner * 2,
          borderRadius: inner,
          backgroundColor: "#fff",
          top: half - inner,
          left: half - inner,
        }}
      />

      {/* ── White gap → opens the G on the right ── */}
      <View
        style={{
          position: "absolute",
          width: gapW,
          height: gapH,
          backgroundColor: "#fff",
          right: 0,
          top: half - gapH / 2,
        }}
      />

      {/* ── Blue crossbar ── */}
      <View
        style={{
          position: "absolute",
          width: barW,
          height: barH,
          backgroundColor: "#4285F4",
          right: 0,
          top: half - barH / 2,
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  q: { position: "absolute", overflow: "hidden" },
  c: { position: "absolute" },
});
