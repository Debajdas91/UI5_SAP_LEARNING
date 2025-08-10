sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, syncStyleClass, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("sap.training.exc.controller.Overview", {

            onInit: function () {
                // Initialize customer model for new customer form
                var oCustomerModel = new JSONModel();
                this.getView().setModel(oCustomerModel, "customer");

                // Load the main data model
                var oModel = new JSONModel("model/data.json");
                this.getView().setModel(oModel);

                // Initialize bookings model
                var oBookingsModel = new JSONModel();
                this.getView().setModel(oBookingsModel, "bookings");
            },

            onSave: function () {
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "sap.training.exc.view.Dialog"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onCloseDialog: function() {
                this.byId("dialog").close();
            },

            onCustomerSelect: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var oContext = oSelectedItem.getBindingContext();
                var oCustomerData = oContext.getObject();
                
                this._showCustomerBookings(oCustomerData);
            },

            onCustomerPress: function(oEvent) {
                var oContext = oEvent.getSource().getBindingContext();
                var oCustomerData = oContext.getObject();
                
                this._showCustomerBookings(oCustomerData);
            },

            _showCustomerBookings: function(oCustomerData) {
                // Get bookings for selected customer
                var aBookings = oCustomerData._Bookings || [];
                
                // Set bookings data to the bookings model
                var oBookingsModel = this.getView().getModel("bookings");
                oBookingsModel.setData(aBookings);
                
                // Update panel title
                var oBookingsTitle = this.byId("bookingsTitle");
                oBookingsTitle.setText("Bookings for " + oCustomerData.CustomerName + " (" + aBookings.length + " bookings)");
                
                // Show bookings panel
                var oBookingsPanel = this.byId("bookingsPanel");
                oBookingsPanel.setVisible(true);
            },

            onCloseBookings: function() {
                // Hide bookings panel
                var oBookingsPanel = this.byId("bookingsPanel");
                oBookingsPanel.setVisible(false);
                
                // Clear selection in customers table
                var oTable = this.byId("customersTable");
                oTable.removeSelections();
            },

            onSearchCustomers: function(oEvent) {
                var sQuery = oEvent.getParameter("query");
                var oTable = this.byId("customersTable");
                var oBinding = oTable.getBinding("items");
                
                if (sQuery) {
                    var aFilters = [
                        new Filter("CustomerName", FilterOperator.Contains, sQuery),
                        new Filter("CustomerNumber", FilterOperator.Contains, sQuery),
                        new Filter("City", FilterOperator.Contains, sQuery),
                        new Filter("Email", FilterOperator.Contains, sQuery)
                    ];
                    var oFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });
                    oBinding.filter([oFilter]);
                } else {
                    oBinding.filter([]);
                }
            },

            formatBookingStatus: function(sCancelled) {
                return sCancelled === "X" ? "Cancelled" : "Active";
            },

            formatBookingState: function(sCancelled) {
                return sCancelled === "X" ? "Error" : "Success";
            }
        });
    });