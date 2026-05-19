import React from "react";
import { useCssElement } from "react-native-css";
import {
  Image as RNImage,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
} from "react-native";

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export function View(props: ViewProps) {
  return useCssElement(RNView, props, { className: "style" });
}

export type TextProps = React.ComponentProps<typeof RNText> & {
  className?: string;
};

export function Text(props: TextProps) {
  return useCssElement(RNText, props, { className: "style" });
}

export type ImageProps = React.ComponentProps<typeof RNImage> & {
  className?: string;
};

export function Image(props: ImageProps) {
  return useCssElement(RNImage, props, { className: "style" });
}

export type TouchableOpacityProps = React.ComponentProps<
  typeof RNTouchableOpacity
> & {
  className?: string;
};

export function TouchableOpacity(props: TouchableOpacityProps) {
  return useCssElement(RNTouchableOpacity, props, { className: "style" });
}

export type ScrollViewProps = React.ComponentProps<typeof RNScrollView> & {
  className?: string;
  contentContainerClassName?: string;
};

export function ScrollView(props: ScrollViewProps) {
  return useCssElement(RNScrollView, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
}

export type TextInputProps = React.ComponentProps<typeof RNTextInput> & {
  className?: string;
};

export function TextInput(props: TextInputProps) {
  return useCssElement(RNTextInput, props, { className: "style" });
}
