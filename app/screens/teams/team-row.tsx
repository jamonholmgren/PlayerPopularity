import React from "react"
import { View, Image } from "react-native"
import { Text } from "../../components/text"

export function TeamRow(props) {
  return (
    <View>
      <Image source={{ uri: props.imgURL }} />
      <Text text={props.name} />
    </View>
  )
}
