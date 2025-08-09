sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("sap.training.exc.controller.App", {
          onInit : function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
          }

        });
    });