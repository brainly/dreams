figma.showUI(__html__);

figma.ui.on('message', (msg, props) => {
  console.log(msg, props);
});
