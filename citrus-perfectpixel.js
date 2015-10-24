if(!Citrus)
var Citrus = {};
Citrus.perfectpixel = {
    container: {},
    containerImage: {},
    settingsPanel: {},
    imagesContainer: {},
    images: [],
    imageItems: [],
    settings:{
        container: {
            opacity: 0.8,
            top: 0,
            left: 0,
            right: 0,
            visible: true,
            imageIndex: 0,
            imageSize: 100
        },
        settingsPanel:{
            top: 0,
            right: 0,
            visible: true,
            deployed: true
        }
    },
    init: function () {
        this.containerCreate();
        this.localStorageRead();
        this.settingsInit();
        this.settingsPanelControls.init(this);
    },
    containerCreate: function () {
        this.container = document.createElement("div");
        this.container.classList.add("cnf-container");
        this.containerImage = document.createElement("div");
        this.containerImage.classList.add("cnf-container-image");
        this.container.appendChild(this.containerImage);
        this.settingsPanel = document.createElement("div");
        this.settingsPanel.classList.add("cnf-settings_panel");
        var body = document.getElementsByTagName("body");
        body[0].appendChild(this.container);
        body[0].appendChild(this.settingsPanel);
        this.settingsPanel.innerHTML = this.settingPanelTemplate;
        this.imagesContainer = document.querySelector(".cnf-images");
    },
    settingsInit: function () {
        this.containerImage.style.opacity = this.settings.container.opacity;
        this.containerImage.style.top = this.settings.container.top + "px";
        this.containerImage.style.left = this.settings.container.left + "px";
        this.containerImage.style.right = this.settings.container.right + "px";
        var display = this.settings.container.visible ? "block" : "none";
        this.containerImage.style.display = display;
        if(this.images.length > 0)
        this.containerImage.style.backgroundImage = "url("+this.images[this.settings.container.imageIndex]+")";
        this.containerImage.style.backgroundSize = this.settings.container.imageSize+"%";
        this.settingsPanel.style.top = this.settings.settingsPanel.top + "px";
        this.settingsPanel.style.right = this.settings.settingsPanel.right + "px";
        display = this.settings.container.visible ? "block" : "none";
        this.settingsPanel.style.display = display;
        if(!this.settings.settingsPanel.deployed)
        this.settingsPanel.style.classList.add("hclasse");
    },
    localStorageRead: function () {
        var localSettings = localStorage.getItem("pf-settings");
        var images = localStorage.getItem("pf-images");
        if(images)
            this.images = JSON.parse(images);
        if(localSettings)
            this.settings = JSON.parse(localSettings);
    },
    localStorageWrite: function () {
        console.log(this.settings);
        localStorage.setItem("pf-settings", JSON.stringify(this.settings));
        localStorage.setItem("pf-images", JSON.stringify(this.images));
    },
    addImage: function (url) {
        var imgItem = document.createElement("li");
        imgItem.classList.add("cnf-images-item");
        imgItem.style.backgroundImage = "url("+url+")";
        this.containerImage.style.backgroundImage = "url("+url+")";
        this.images.push(url);
        this.imagesContainer.appendChild(imgItem);
        for(var img in this.imageItems){
            this.imageItems[img].classList.remove("active");
        }
        imgItem.classList.add("active");
        this.imageItems.push(imgItem);
    },
    settingPanelTemplate: '<div class="cnf-form-group"><label for="cnf-x">x:</label><input class="cnf-x" value="0" type="text"/> </div> <div class="cnf-form-group"> <label for="cnf-y">y:</label><input class="cnf-y" value="0" type="text"/> </div> <div class="cnf-form-group"> <label for="cnf-opacity">opacity:</label><input value="0" class="cnf-opacity" type="text"/> </div> <div> <input class="cnf-opacity-range" value="0" type="range"/> </div> <input type="file" class="cnf-load-image"/><button class="cnf-load-image-button">Загрузить файл</button><ul class="cnf-images"></ul><span class="cnf-deployed"></span>',
    settingsPanelControls: {
        inputX: {},
        inputY: {},
        inputOpacity: {},
        inputOpacityRange: {},
        inputFile: {},
        buttonFile: {},
        cnfObj: {},
        init: function (cnfObj) {
            this.cnfObj = cnfObj;
            this.inputX = document.querySelector(".cnf-x");
            this.inputY = document.querySelector(".cnf-y");
            this.inputOpacity = document.querySelector(".cnf-opacity");
            this.inputOpacityRange = document.querySelector(".cnf-opacity-range");
            this.inputFile = document.querySelector(".cnf-load-image");
            this.buttonFile = document.querySelector(".cnf-load-image-button");
            this.listener();
        },
        listener: function () {
            this.inputXInput = this.inputXInput.bind(this);
            this.inputYInput = this.inputYInput.bind(this);
            this.inputOpacityInput = this.inputOpacityInput.bind(this);
            this.inputOpacityRangeInput = this.inputOpacityRangeInput.bind(this);
            this.fileDialogOpen = this.fileDialogOpen.bind(this);
            this.addImage = this.addImage.bind(this);
            this.inputX.addEventListener("input", this.inputXInput);
            this.inputY.addEventListener("input", this.inputYInput);
            this.inputOpacity.addEventListener("input", this.inputOpacityInput);
            this.inputOpacityRange.addEventListener("input", this.inputOpacityRangeInput);
            this.buttonFile.addEventListener("click", this.fileDialogOpen);
            this.inputFile.addEventListener("change", this.addImage);
        },
        inputXInput: function (e) {
            var val = this.inputX.value;
            if (!isNaN(+val)) {
                this.cnfObj.settings.container.left = +val;
                this.cnfObj.containerImage.style.left = +val +"px";
                this.cnfObj.localStorageWrite();
            } else
                this.inputX.value = this.cnfObj.settings.constructor.left;
        },
        inputYInput: function (e) {
            var val = this.inputY.value;
            if (!isNaN(+val)) {
                this.cnfObj.settings.container.top = +val;
                this.cnfObj.containerImage.style.top = +val +"px";
                this.cnfObj.localStorageWrite();
            } else
                this.inputY.value = this.cnfObj.settings.container.top;
        },
        inputOpacityInput: function (e) {
            var val = this.inputOpacity.value;
            if (!isNaN(+val)  && +val >= 0 && +val <= 1) {
                this.cnfObj.settings.container.opacity = +val;
                this.cnfObj.containerImage.style.opacity = +val;
                this.cnfObj.localStorageWrite();
                this.inputOpacityRange.value = +val*100;
            } else if(+val < 0 ){
                this.inputOpacity.value = 0;
                this.inputOpacityRange.value = 0;
            }else if(+val > 1){
                this.inputOpacity.value = 1;
                this.inputOpacityRange.value = 100;
            }

        },
        inputOpacityRangeInput: function (e) {
            var val = this.inputOpacityRange.value;
            if (!isNaN(+val) && +val >= 0 && +val <= 100) {
                this.cnfObj.settings.container.opacity = +val/100;
                this.cnfObj.containerImage.style.opacity = +val/100;
                this.cnfObj.localStorageWrite();
                this.inputOpacity.value = +val/100;
            } else if(+val < 0 ){
                this.inputOpacity.value = 0;
                this.inputOpacityRange.value = 0;
            }else if(+val > 1){
                this.inputOpacity.value = 1;
                this.inputOpacityRange.value = 100;
            }
        },
        fileDialogOpen: function () {
            console.log(this.inputFile);
            this.inputFile.click();

        },
        addImage: function (e) {
           if(e.target.files){
               for(var file in e.target.files){
                   if(e.target.files[file].type == "image/jpeg" ||
                       e.target.files[file].type == "image/jpg" ||
                       e.target.files[file].type == "image/png" ){
                       var fileReader = new FileReader();
                       var that = this;
                       fileReader.onload = function(img)
                       {
                            console.log(img);
                           that.cnfObj.addImage(img.target.result);
                       };
                       fileReader.readAsDataURL(e.target.files[file]);
                   }
               }
           }
        },
        getBase64Image: function(img) {
            // создаем канвас элемент
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            console.log(img);
            var img1 = new Image();
            console.log(img1);
            // Копируем изображение на канвас
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Получаем data-URL отформатированную строку
            // Firefox поддерживает PNG и JPEG.
            var dataURL = canvas.toDataURL(img.type);

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

}
};

(function () {
    Citrus.perfectpixel.init();
})();