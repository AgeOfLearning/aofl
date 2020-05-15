const testContainer = document.getElementById('test-container');

const cleanTestContainer = () => {
  while (testContainer.firstChild) {
    testContainer.removeChild(testContainer.firstChild);
  }
};

const getTestContainer = () => {
  const iframe = document.createElement('div');
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  testContainer.appendChild(iframe);

  return iframe;
};

const getTestFrame = () => {
  return testContainer.firstChild;
};

window.getTestContainer = getTestContainer;
window.cleanTestContainer = cleanTestContainer;
window.getTestFrame = getTestFrame;

// window.scrollTo(0,document.body.scrollHeight);
