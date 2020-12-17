/* global tm */

const mainEl = document.querySelector('#container');

const wizard = new tm.Wizard({
  introduction: {
    title: tm.html`开始训练你的边缘设备识别是你否在招手`,
    description: tm.html`点击 "开始", 需要相机权限. `
  },
  classes: [
    {
      name: "Hand down",
      title: "记录一些没招手的例子",
      description:
        "按记录按钮记录至少20帧没招手的图片. "
    },
    {
      name: "Hand Up",
      title: "记录一些招手的例子",
      description:
        "按记录按钮记录至少20帧招手的图片."
    }
  ],
  onLoad: () => {
    console.log("model has loaded");
  },
  onPrediction: predictions => {
    const images = document.querySelectorAll('.prediction-image');
    let highestProb = Number.MIN_VALUE;
    let highestIndex = -1;
    predictions.forEach((pred, i) => {
      if (pred.probability > highestProb) {
        highestProb = pred.probability;
        highestIndex = i;
      }
    });
    images.forEach((img, i) => {
      if (i === highestIndex) {
        img.classList.remove('hidden');
      } else {
        img.classList.add('hidden');
      }
    });
  },
  onSampleAdded: added => {
    console.log(added);
  },
  onTrain: () => console.log("train begins"),
  onReady: () => {
    const inferenceCamera = wizard.createInferenceCamera({
      size: 270
    });
    const cameraContainer = document.querySelector('#inference-camera-container');
    cameraContainer.appendChild(inferenceCamera);
    mainEl.classList.add('ready');
  }
});

document.querySelector('#train-model-button').addEventListener('click', () => wizard.open());
