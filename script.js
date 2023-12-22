function isLocalStorageSupported() {
    try {
      const testKey = "test";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  function initializePage() {
    updateFileList();
    initializeDragAndDrop();
  }
  
  function initializeDragAndDrop() {
    const dropArea = document.querySelector(".drop-area");
    const fileInput = document.querySelector("#file-input");
  
    dropArea.addEventListener("dragenter", (e) => {
      e.preventDefault();
      dropArea.classList.add("drop-area-over");
    });
  
    dropArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropArea.classList.remove("drop-area-over");
    });
  
    dropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  
    dropArea.addEventListener("drop", (e) => {
      e.preventDefault();
      dropArea.classList.remove("drop-area-over");
      const transferredFiles = e.dataTransfer.files;
  
      handleFiles(transferredFiles);
    });
  
    fileInput.addEventListener("change", (e) => {
      const selectedFiles = e.target.files;
      handleFiles(selectedFiles);
      fileInput.value = '';
    });
  }
  
  function handleFiles(files) {
    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        saveFileToLocalStorage(file.name, file.type, file.size, e.target.result);
  
        updateFileList();
  
        addFilePreview(file);
      };
      reader.onerror = function (e) {
        console.error(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }
  
  function saveFileToLocalStorage(fileName, fileType, fileSize, fileDataUrl) {
    if (isLocalStorageSupported()) {
      let files = JSON.parse(localStorage.getItem("files")) || [];
      files.push({ name: fileName, type: fileType, size: fileSize, dataUrl: fileDataUrl });
      localStorage.setItem("files", JSON.stringify(files));
    } else {
      console.log("Local storage is not supported!");
    }
  }
  
  function removeFileFromLocalStorage(fileName) {
    if (isLocalStorageSupported()) {
      let files = JSON.parse(localStorage.getItem("files")) || [];
      files = files.filter((file) => file.name !== fileName);
      localStorage.setItem("files", JSON.stringify(files));
  
      updateFileList();
    } else {
      console.log("Local storage is not supported!");
    }
  }
  
  function updateFileList() {
    const fileList = document.querySelector("#file-list");
    const files = JSON.parse(localStorage.getItem("files")) || [];
  
    while (fileList.firstChild) {
      fileList.removeChild(fileList.firstChild);
    }
  
    files.forEach((file) => {
      const listItem = document.createElement("li");
  
      const fileNameSpan = document.createElement("span");
      fileNameSpan.textContent = `НАЗВАНИЕ: ${file.name}`;
      listItem.appendChild(fileNameSpan);
  
      const fileTypeSpan = document.createElement("span");
      fileTypeSpan.textContent = ` ТИП: ${file.type}`;
      listItem.appendChild(fileTypeSpan);
  
      const fileSizeSpan = document.createElement("span");
      fileSizeSpan.textContent = ` ВЕС ФАЙЛА: ${file.size} байт`;
      listItem.appendChild(fileSizeSpan);
  
      const downloadLink = document.createElement("a");
      downloadLink.textContent = "Скачать";
      downloadLink.setAttribute("href", file.dataUrl);
      downloadLink.setAttribute("download", file.name);
      listItem.appendChild(downloadLink);
  
      fileList.appendChild(listItem);
    });
  }
  
  function addFilePreview(file) {
    const dropArea = document.querySelector(".drop-area");
  
    const dropAreaPreview = document.createElement("div");
    dropAreaPreview.className = "drop-area-preview";
  
    const fileImage = document.createElement("img");
    fileImage.className = "drop-area-image";
    fileImage.src = URL.createObjectURL(file);
    fileImage.alt = file.name;
    dropAreaPreview.appendChild(fileImage);
  
    const fileNameDiv = document.createElement("div");
    fileNameDiv.className = "drop-area-name";
    fileNameDiv.textContent = file.name;
    dropAreaPreview.appendChild(fileNameDiv);
  
    const removeButton = document.createElement("div");
    removeButton.className = "drop-area-remove";
    removeButton.innerHTML = `
        <svg viewBox="0 0 24 24" height="24" width="24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path fill="#f5f5f5" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>
    `;
    removeButton.addEventListener("click", function () {
      removeFileFromLocalStorage(file.name);
      dropAreaPreview.remove();
    });
    dropAreaPreview.appendChild(removeButton);
  
    dropArea.appendChild(dropAreaPreview);
  }
  
  window.addEventListener("load", initializePage);
  