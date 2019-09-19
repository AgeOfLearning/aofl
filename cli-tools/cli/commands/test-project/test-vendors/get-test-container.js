const getTestContainer = () => {
  const mainTestContainer = document.getElementById('test-container');
  const testContainer = document.createElement('div');
  mainTestContainer.insertBefore(testContainer, mainTestContainer.firstChild);

  return testContainer;
};

const cleanTestContainer = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

window.getTestContainer = getTestContainer;
window.cleanTestContainer = cleanTestContainer;
