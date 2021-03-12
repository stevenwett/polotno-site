import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react-lite";
import { InputGroup } from "@blueprintjs/core";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { createStore } from "polotno/model/store";

import { getImageSize } from "polotno/utils/image";

// import all default sections
// we will not use all of them in the demo
// just to show what we have
import {
  TextSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  SizeSection
} from "polotno/side-panel/side-panel";
//
import { SectionTab } from "polotno/side-panel/tab-button";
import { ImagesGrid } from "polotno/side-panel/images-grid";
// import our own icon
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";

const store = createStore({
  // this is a demo key just for that project
  // (!) please don't use it in your projects
  // to create your own API key please go here: https://polotno.dev/cabinet
  key: "nFA5H9elEytDyPyvKL7T"
});

store.addPage();
store.activePage.addElement({
  type: "text",
  text: "hello"
});

export const PhotosPanel = observer(({ store }) => {
  const [images, setImages] = React.useState([]);

  async function loadImages() {
    // here we should implement your own API requests
    setImages([]);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // for demo images are hard coded
    // in real app here will be something like JSON structure
    setImages([
      { url: "./carlos-lindner-zvZ-HASOA74-unsplash.jpg" },
      { url: "./guillaume-de-germain-TQWJ4rQnUHQ-unsplash.jpg" }
    ]);
  }

  React.useEffect(() => {
    loadImages();
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <InputGroup
        leftIcon="search"
        placeholder="Search..."
        onChange={(e) => {
          loadImages();
        }}
        style={{
          marginBottom: "20px"
        }}
      />
      <p>Demo images: </p>
      {/* you can create yur own custom component here */}
      {/* but we will use built-in grid component */}
      <ImagesGrid
        images={images}
        getPreview={(image) => image.url}
        onSelect={async (image, { x, y }) => {
          const { width, height } = await getImageSize(image.url);
          store.activePage.addElement({
            type: "image",
            src: image.url,
            width,
            height,
            x,
            y
          });
        }}
        rowsNumber={2}
        isLoading={!images.length}
        loadMore={false}
      />
    </div>
  );
});

// define the new custom section
const СustomPhotos = {
  name: "photos",
  Tab: (props) => (
    <SectionTab name="Photos" {...props}>
      <MdPhotoLibrary />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: PhotosPanel
};

// we will have just two sections
const sections = [
  TextSection,
  СustomPhotos,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  // we will replace default resize with our own
  SizeSection
];

export const App = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%"
      }}
    >
      <div style={{ width: "200px", height: "100%", display: "flex" }}>
        <SidePanel store={store} sections={sections} defaultSection="photos" />
      </div>
      <div
        style={{
          display: "flex",
          height: "100%",
          margin: "auto",
          flex: 1,
          flexDirection: "column",
          position: "relative"
        }}
      >
        <Toolbar store={store} downloadButtonEnabled={true} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
