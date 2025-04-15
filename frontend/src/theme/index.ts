import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#3F3F94",
      hover: "#4b4ba1"
    }
  },
  styles: {
    global: {
      body: {
        color: "black",
        bg: "gray.100"
      }
    }
  },
  components: {
    Text: {
      baseStyle: {
        color: "black"
      }
    },
    Heading: {
      baseStyle: {
        color: "black"
      }
    }
  }
})

export default theme