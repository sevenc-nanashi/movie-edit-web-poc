import { Box, Button, Heading, Text } from "@hope-ui/core"
import { Component, createSignal, Match, Switch } from "solid-js"

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"

const App: Component = () => {
  let fileInput: HTMLInputElement
  const ffmpeg = createFFmpeg({
    log: true,
  })

  const [frameExtractState, setFrameExtractState] = createSignal<
    "idle" | "loading" | "done" | "error"
  >("idle")
  const [extractedFrame, setExtractedFrame] = createSignal<string | null>(null)

  const handleFile = async () => {
    if (!ffmpeg.isLoaded()) await ffmpeg.load()
    setFrameExtractState("loading")
    const file = fileInput.files[0]
    ffmpeg.FS("writeFile", file.name, await fetchFile(file))
    try {
      await ffmpeg.run("-i", file.name, "-vframes", "1", "out.png")

      const data = ffmpeg.FS("readFile", "out.png")
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/png" })
      )
      setExtractedFrame(url)
      setFrameExtractState("done")
    } catch (e) {
      console.log(e)
      setFrameExtractState("error")
    }
  }

  return (
    <Box p="8">
      <Heading size="3xl">Movie Edit on JavaScript</Heading>
      <Box mt="4">
        <Box
          shadow="md"
          p="4"
          rounded="md"
          bg="Gray"
          mb="2"
          style={{
            "max-width": "600px",
            "aspect-ratio": "16/9",
            "background-image": `url(${extractedFrame()})`,
            "background-size": "cover",
          }}
        ></Box>
        <Box>
          <Button
            cursor="pointer"
            onClick={() => {
              fileInput.click()
            }}
          >
            Upload your video
          </Button>

          <Text ml="2" display="inline-block">
            <Switch>
              <Match when={frameExtractState() === "idle"}>...</Match>
              <Match when={frameExtractState() === "loading"}>
                Extracting...
              </Match>
              <Match when={frameExtractState() === "done"}>Done!</Match>
              <Match when={frameExtractState() === "error"}>Error!</Match>
            </Switch>
          </Text>
        </Box>
        <input
          type="file"
          id="file"
          style="display: none"
          ref={fileInput}
          onChange={handleFile}
        />
      </Box>
    </Box>
  )
}

export default App
