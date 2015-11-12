if(!Citrus)
var Citrus = {};
Citrus.perfectpixel = {
    container: {},

    containerImage: {},
    settingsPanel: {},
    settingPanelButtonOpen: {},
    settingPanelButtonLock: {},
    settingPanelButtonVisible: {},
    imagesContainer: {},
    images: [],
    imageItems: [],
    localImages: [],
    settings:{
        container: {
            opacity: 0.8,
            top: 0,
            left: 0,
            right: 0,
            visible: true,
            imageIndex: 0,
            imageSize: 100,
            lock: true,
            open: true
        },
        settingsPanel:{
            top: 0,
            right: 0,
            visible: true,
            deployed: true
        },
        site: {
            opacity: 1
        }
    },
    mouseSettings:{
        x: 0,
        y: 0,
        panelX: 0,
        panelY: 0
    },
    imageCounter: 0,
    siteContainer: 0,
    init: function (arrImages, siteContainer) {
        if(typeof arrImages === "object" ){
            this.localImages = arrImages;
            if(siteContainer)
                this.siteContainer = document.querySelector(siteContainer);
            this.containerCreate();
            this.localStorageRead();
            this.settingsInit();
            this.settingsPanelControls.init(this);
            this.listener();
        }else{
            console.warn("Не найден масив с изображениями");
        }
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
        if(this.localImages.length > 0){
            console.log(this.localImages);
            for(var i = 0; i < this.localImages.length; i++){
                this.addImage(this.localImages[i]);
            }
            this.containerImage.style.backgroundImage = "url("+this.localImages[this.settings.container.imageIndex]+")";
        }
       // this.containerImage.style.backgroundSize = this.settings.container.imageSize+"%";
        this.settingsPanel.style.top = this.settings.settingsPanel.top + "px";
        this.settingsPanel.style.right = this.settings.settingsPanel.right + "px";
        display = this.settings.container.visible ? "block" : "none";
        this.settingsPanel.style.display = display;
        if(!this.settings.settingsPanel.deployed)
        this.settingsPanel.style.classList.add("hclasse");
        if(this.siteContainer)
            this.siteContainer.style.opacity = this.settings.site.opacity;
    },
    localStorageRead: function () {
        var localSettings = localStorage.getItem("pf-settings");
        localSettings = JSON.parse(localSettings);
        if(typeof localSettings === "object" && localSettings ){
            this.settings = localSettings;
            console.log(localSettings);
        }

    },
    localStorageWrite: function () {
        localStorage.setItem("pf-settings", JSON.stringify(this.settings));
    },
    addImage: function (url) {
        var imgItem = document.createElement("li");
        imgItem.classList.add("cnf-images-item");
        imgItem.style.backgroundImage = "url("+url+")";
        imgItem.setAttribute("data-img-index", this.imageCounter);
        this.imageCounter++;
        this.containerImage.style.backgroundImage = "url("+url+")";
        this.images.push(url);
        this.imagesContainer.appendChild(imgItem);
        for(var img in this.imageItems){
            this.imageItems[img].classList.remove("active");
        }
        imgItem.classList.add("active");
        this.imageItems.push(imgItem);
    },
    listener: function () {
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.panelMouseDown = this.panelMouseDown.bind(this);
        this.panelMouseMove = this.panelMouseMove.bind(this);
        this.panelMouseUp = this.panelMouseUp.bind(this);
        this.containerImage.addEventListener("mousedown", this.mouseDown);
        this.settingsPanel.addEventListener("click", this.panelMouseDown);
        for(var img in this.imageItems)
            this.imageItems[img].addEventListener("click", this.changeImage);
    },
    mouseDown: function (e) {
        if(e.currentTarget.classList.contains("cnf-container-image") && !this.settings.lock) {
            this.containerImage.classList.add("down");
            document.addEventListener("mousemove", this.mouseMove);
            document.addEventListener("mouseup", this.mouseUp);
            this.mouseSettings.x = e.pageX;
            this.mouseSettings.y = e.pageY;
        }
    },

    mouseMove: function (e) {
        console.log(e);
        var x = this.mouseSettings.x - e.pageX;
        var y = this.mouseSettings.y - e.pageY;
        x =  this.settings.container.x - x;
        y =  this.settings.container.y - y;
        this.mouseSettings.x = e.pageX;
        this.mouseSettings.y = e.pageY;
        this.positionImage(x, y);
    },
    changeImage: function (e) {
        var image = e.currentTarget.style.backgroundImage;
        if(image)
        this.containerImage.style.backgroundImage = image;
        for(var img in this.imageItems){
            this.imageItems[img].classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        var indexImage = e.currentTarget.getAttribute("data-img-index");
        if(!isNaN(+indexImage))
        this.settings.container.imageIndex = +indexImage;
        this.localStorageWrite();
    },
    mouseUp: function () {
        this.containerImage.classList.remove("down");
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseUp);
        this.localStorageWrite();
    },
    panelMouseMove: function (e) {
        var x = this.mouseSettings.panelX - e.pageX;
        var y = this.mouseSettings.panelY - e.pageY;
        this.settingsPanel.style.left =  this.settings.settingsPanel.x - x + "px";
        this.settingsPanel.style.top =  this.settings.settingsPanel.y - y + "px";
        this.mouseSettings.panelX = e.pageX;
        this.mouseSettings.panelY = e.pageY;

    },
    panelMouseDown: function (e) {
        if(e.currentTarget.classList.contains("cnf-settings_panel")) {
            document.addEventListener("mousemove", this.panelMouseMove);
            document.addEventListener("mouseup", this.panelMouseUp);
            this.mouseSettings.panelX = e.pageX;
            this.mouseSettings.panelY = e.pageY;
        }
    },
    panelMouseUp: function (e) {
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseUp);
        this.localStorageWrite();
    },
    positionImage: function (x, y) {
        console.log("x: " + x + " y: " +y);
        this.settings.container.x = x;
        this.settings.container.y = y;
        this.settingsPanelControls.inputX.value = x;
        this.settingsPanelControls.inputY.value = y;
        this.containerImage.style.left = x + "px";
        this.containerImage.style.top = y + "px";
    },
    settingPanelTemplate: '<div class="cnf-settings_panel-controls">' +
    '<div class="cnf-form-group">' +
    '<label for="cnf-x">x:</label>' +
    '<input class="cnf-x" value="0" type="text"/> ' +
    '</div><div class="cnf-form-group">' +
    ' <label for="cnf-y">y:</label>' +
    '<input class="cnf-y" value="0" type="text"/> ' +
    '</div>' +
    '<div class="cnf-form-group">' +
    ' <label for="cnf-opacity">opacity:</label>' +
    '<input value="0" class="cnf-opacity" type="text"/>' +
    '</div>' +
    '<div>' +
    '<div>pf-container:</div>' +
    '<input value="0" class="cnf-opacity-range" type="range"/>' +
    '</div>' +
    '<div class="cnf-site-controls">' +
    '<div class="cnf-row">' +
    '<div class="cnf-form-group right "> ' +
    '<label for="cnf-opacity-site">site opacity:</label>' +
    '<input value="0" class="cnf-opacity-site" type="text"/></div>' +
    '</div>' +
    '<div>site-container:</div>' +
    '<input value="0" class="cnf-opacity-range-site" type="range"/>' +
    '</div>' +
    '<ul class="cnf-images"></ul>' +
    '</div> ' +
    '<div class="cnf-icon-open"></div>' +
    '<div class="cnf-icon-lock"></div>' +
    '<div class="cnf-icon-visible"></div>',
    settingsPanelControls: {
        inputX: {},
        inputY: {},
        inputOpacity: {},
        inputOpacityRange: {},
        inputOpacitySite: {},
        inputOpacityRangeSite: {},
        inputFile: {},
        buttonFile: {},
        cnfObj: {},
        buttonOpen: {},
        buttonLock: {},
        buttonVisible: {},
        controlsContainer: {},
        init: function (cnfObj) {
            this.cnfObj = cnfObj;
            this.inputX = document.querySelector(".cnf-x");
            this.inputY = document.querySelector(".cnf-y");
            this.inputOpacity = document.querySelector(".cnf-opacity");
            this.inputOpacityRange = document.querySelector(".cnf-opacity-range");
            this.inputOpacitySite = document.querySelector(".cnf-opacity-site");
            this.inputOpacityRangeSite = document.querySelector(".cnf-opacity-range-site");
            this.buttonOpen = document.querySelector(".cnf-icon-open");
            this.buttonLock = document.querySelector(".cnf-icon-lock");
            this.buttonVisible = document.querySelector(".cnf-icon-visible");
            this.controlsContainer = document.querySelector(".cnf-settings_panel-controls");
            if(this.cnfObj.settings.lock)
                this.buttonLock.classList.add("active");
            if(!this.cnfObj.settings.open){
                this.controlsContainer.classList.add("hide");
                this.buttonOpen.classList.add("active");
            }
            if(!this.cnfObj.settings.visible){
                this.cnfObj.containerImage.classList.add("hide");
                this.buttonVisible.classList.add("active");
            }
            if(!this.cnfObj.siteContainer){
                var siteControls = document.querySelector(".cnf-site-controls");
                siteControls.classList.add("cnf-hide");
            }
            this.settingsInit();
            this.listener();
        },
        settingsInit: function () {
            this.inputX.value = this.cnfObj.settings.container.left;
            this.inputY.value = this.cnfObj.settings.container.top;
            this.inputOpacity.value = this.cnfObj.settings.container.opacity;
            this.inputOpacityRange.value = this.cnfObj.settings.container.opacity * 100;
            this.inputOpacitySite.value = this.cnfObj.settings.site.opacity;
            this.inputOpacityRangeSite.value = this.cnfObj.settings.site.opacity * 100;
        },
        listener: function () {
            this.inputX.addEventListener("input", this.inputXInput.bind(this));
            this.inputY.addEventListener("input", this.inputYInput.bind(this));
            this.inputOpacity.addEventListener("input", this.inputOpacityInput.bind(this));
            this.inputOpacityRange.addEventListener("input", this.inputOpacityRangeInput.bind(this));

            this.buttonLock.addEventListener("click", this.lock.bind(this));
            this.buttonOpen.addEventListener("click", this.open.bind(this));
            this.buttonVisible.addEventListener("click", this.visible.bind(this));
            if(this.cnfObj.siteContainer){
            this.inputOpacitySite.addEventListener("input", this.inputOpacitySiteInput.bind(this));
            this.inputOpacityRangeSite.addEventListener("input", this.inputOpacityRangeSiteInput.bind(this));
            }
        },
        lock: function () {
          if(!this.cnfObj.settings.lock){
              this.buttonLock.classList.add("active");
              this.cnfObj.settings.lock = true;
          }else{
              this.buttonLock.classList.remove("active");
              this.cnfObj.settings.lock = false;
          }
            this.cnfObj.localStorageWrite();
        },
        open: function () {
            if(!this.cnfObj.settings.open){
                this.controlsContainer.classList.remove("hide");
                this.buttonOpen.classList.remove("active");
                this.cnfObj.settings.open = true;
            }else{
                this.controlsContainer.classList.add("hide");
                this.buttonOpen.classList.add("active");
                this.cnfObj.settings.open = false;
            }
            this.cnfObj.localStorageWrite();
        },
        visible: function () {
            if(!this.cnfObj.settings.visible){
                this.cnfObj.containerImage.classList.remove("hide");
                this.buttonVisible.classList.remove("active");
                this.cnfObj.settings.visible = true;
            }else{
                this.cnfObj.containerImage.classList.add("hide");
                this.buttonVisible.classList.add("active");
                this.cnfObj.settings.visible = false;
            }
            this.cnfObj.localStorageWrite();
        },
        inputXInput: function (e) {
            var val = this.inputX.value;
            if (!isNaN(+val)) {
                this.cnfObj.settings.container.left = +val;
                this.cnfObj.containerImage.style.left = +val + "px";
                this.cnfObj.localStorageWrite();
            } else
                this.inputX.value = this.cnfObj.settings.constructor.left;
        },
        inputYInput: function (e) {
            var val = this.inputY.value;
            if (!isNaN(+val)) {
                this.cnfObj.settings.container.top = +val;
                this.cnfObj.containerImage.style.top = +val + "px";
                this.cnfObj.localStorageWrite();
            } else
                this.inputY.value = this.cnfObj.settings.container.top;
        },
        inputOpacityInput: function (e) {
            var val = this.inputOpacity.value;
            if (!isNaN(+val) && +val >= 0 && +val <= 1) {
                this.cnfObj.settings.container.opacity = +val;
                this.cnfObj.containerImage.style.opacity = +val;
                this.cnfObj.localStorageWrite();
                this.inputOpacityRange.value = +val * 100;
            } else if (+val < 0) {
                this.inputOpacity.value = 0;
                this.inputOpacityRange.value = 0;
            } else if (+val > 1) {
                this.inputOpacity.value = 1;
                this.inputOpacityRange.value = 100;
            }

        },
        inputOpacityRangeInput: function (e) {
            var val = this.inputOpacityRange.value;
            if (!isNaN(+val) && +val >= 0 && +val <= 100) {
                this.cnfObj.settings.container.opacity = +val / 100;
                this.cnfObj.containerImage.style.opacity = +val / 100;
                this.cnfObj.localStorageWrite();
                this.inputOpacity.value = +val / 100;
            } else if (+val < 0) {
                this.inputOpacity.value = 0;
                this.inputOpacityRange.value = 0;
            } else if (+val > 1) {
                this.inputOpacity.value = 1;
                this.inputOpacityRange.value = 100;
            }
        },
        inputOpacitySiteInput: function (e) {
            var val = this.inputOpacity.value;
            if (!isNaN(+val) && +val >= 0 && +val <= 1) {
                this.cnfObj.settings.site.opacity = +val;
                this.cnfObj.siteContainer.style.opacity = +val;
                this.cnfObj.localStorageWrite();
                this.inputOpacityRangeSite.value = +val * 100;
            } else if (+val < 0) {
                this.inputOpacitySite.value = 0;
                this.inputOpacityRangeSite.value = 0;
            } else if (+val > 1) {
                this.inputOpacitySite.value = 1;
                this.inputOpacityRangeSite.value = 100;
            }

        },
        inputOpacityRangeSiteInput: function (e) {
            var val = this.inputOpacityRangeSite.value;
            if (!isNaN(+val) && +val >= 0 && +val <= 100) {
                this.cnfObj.settings.site.opacity = +val / 100;
                this.cnfObj.siteContainer.style.opacity = +val / 100;
                this.cnfObj.localStorageWrite();
                this.inputOpacitySite.value = +val / 100;
            } else if (+val < 0) {
                this.inputOpacitySite.value = 0;
                this.inputOpacityRangeSite.value = 0;
            } else if (+val > 1) {
                this.inputOpacitySite.value = 1;
                this.inputOpacityRangeSite.value = 100;
            }
        },
        fileDialogOpen: function () {
            console.log(this.inputFile);
            this.inputFile.click();

        },
        addImage: function (e) {
            if (e.target.files) {
                for (var file in e.target.files) {
                    if (e.target.files[file].type == "image/jpeg" ||
                        e.target.files[file].type == "image/jpg" ||
                        e.target.files[file].type == "image/png") {
                        var fileReader = new FileReader();
                        var that = this;
                        fileReader.onload = function (img) {
                            console.log(img);
                            that.cnfObj.addImage(img.target.result);
                        };
                        fileReader.readAsDataURL(e.target.files[file]);
                    }
                }
            }
        }
    }
};

(function () {
    Citrus.perfectpixel.init(pfImgagesArray, ".container-wrap");
})();