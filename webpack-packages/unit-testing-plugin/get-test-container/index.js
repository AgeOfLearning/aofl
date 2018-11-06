const getTestContainer = () => {
  const mainTestContainer = document.getElementById('test-container');
  const testContainer = document.createElement('div');
  mainTestContainer.insertBefore(testContainer, mainTestContainer.firstChild);

  return testContainer;
};

window.getTestContainer = getTestContainer;
