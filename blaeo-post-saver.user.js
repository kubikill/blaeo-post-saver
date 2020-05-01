// ==UserScript==
// @name         BLAEO Post Saver
// @namespace    blaeo-post-saver
// @version      1.0.0
// @homepage     https://github.com/kubikill/blaeo-post-saver#readme
// @supportURL   https://github.com/kubikill/blaeo-post-saver/issues
// @updateURL    https://kubikill.github.io/blaeo-post-saver/blaeo-post-saver.meta.js
// @downloadURL  https://kubikill.github.io/blaeo-post-saver/blaeo-post-saver.user.js
// @description  Adds a save/load feature to BLAEO posts.
// @author       kubikill
// @match        https://www.backlog-assassins.net/posts/new
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var htmlSaveBtn = '<div class="dropdown" style="display: inline-block; margin-right: 5px"><a id="BLAEOPS_savebtn" class="btn btn-default" data-target="#" data-toggle="dropdown" role="button" aria-expanded="false">Save <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#" data-blaeops_slot="1" data-toggle="modal" data-target="#BLAEOPS_savemodal">Save 1 - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="2" data-toggle="modal" data-target="#BLAEOPS_savemodal">Save 2 - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="3" data-toggle="modal" data-target="#BLAEOPS_savemodal">Save 3 - <span class="BLAEOPS_slotsavename">empty</span></a></li></ul></div>';
    var htmlLoadBtn = '<div class="dropdown" style="display: inline-block; margin: 0 5px"><a id="BLAEOPS_loadbtn" class="btn btn-default" data-target="#" data-toggle="dropdown" role="button" aria-expanded="false">Load <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#" data-blaeops_slot="1" data-toggle="modal" data-target="#BLAEOPS_loadmodal">Save 1 - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="2" data-toggle="modal" data-target="#BLAEOPS_loadmodal">Save 2 - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="3" data-toggle="modal" data-target="#BLAEOPS_loadmodal">Save 3 - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="4" data-toggle="modal" data-target="#BLAEOPS_loadmodal">Autosave - <span class="BLAEOPS_slotsavename">empty</span></a></li><li><a href="#" data-blaeops_slot="5" data-toggle="modal" data-target="#BLAEOPS_loadmodal">Exitsave - <span class="BLAEOPS_slotsavename">empty</span></a></li></ul></div>';
    var htmlSaveMsg = '<span class="text-success" id="BLAEOPS_msg" style="display: none">Post saved!</span>';
    var htmlSaveModal = '<div class="modal fade" tabindex="-1" role="dialog" id="BLAEOPS_savemodal"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Saving in slot <span class="BLAEOPS_modalslot"></span></h4></div><div class="modal-body"><label for="BLAEOPS_modalsavename">Save name:</label><input type="text" class="form-control" id="BLAEOPS_modalsavename"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" data-dismiss="modal">Save</button></div></div></div></div>';
    var htmlLoadModal = '<div class="modal fade" tabindex="-1" role="dialog" id="BLAEOPS_loadmodal"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Loading slot <span class="BLAEOPS_modalslot"></span></h4></div><div class="modal-body"><p>Are you sure you want to load slot <span class="BLAEOPS_modalslot"></span>? Your current post will be replaced!</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" data-dismiss="modal">Load</button></div></div></div></div>'
    
    var previewBtn = document.querySelector("#get-preview");
    var postTextarea = document.querySelector("#post_text");

    previewBtn.insertAdjacentHTML('afterend', htmlSaveMsg);
    var saveMsg = document.querySelector("#BLAEOPS_msg");

    previewBtn.insertAdjacentHTML('afterend', htmlSaveBtn);
    var saveBtn = document.querySelector("#BLAEOPS_savebtn").parentNode;

    previewBtn.insertAdjacentHTML('afterend', htmlLoadBtn);
    var loadBtn = document.querySelector("#BLAEOPS_loadbtn").parentNode;

    document.body.insertAdjacentHTML('beforeend', htmlSaveModal);
    var saveModal = document.querySelector("#BLAEOPS_savemodal");
    var saveName = document.querySelector("#BLAEOPS_modalsavename");

    document.body.insertAdjacentHTML('beforeend', htmlLoadModal);
    var loadModal = document.querySelector("#BLAEOPS_loadmodal");

    var slotnames = [null, "1", "2", "3", "autosave", "exitsave"];

    function triggerLoadModal(slot) {
        loadModal.querySelectorAll(".BLAEOPS_modalslot").forEach(function (item) {
            item.innerHTML = slotnames[slot];
        });
        loadModal.querySelector("button.btn-primary").onclick = function () {
            load(slot);
        }
    }

    function triggerSaveModal(slot) {
        saveModal.querySelectorAll(".BLAEOPS_modalslot").forEach(function (item) {
            item.innerHTML = slotnames[slot];
        });
        saveModal.querySelector("button.btn-primary").onclick = function () {
            save(slot, saveName.value);
        }
    }

    function load(slot) {
        if (localStorage.getItem("BLAEOPS_slot" + slot)) {
            postTextarea.value = localStorage.getItem("BLAEOPS_slot" + slot);
        }
        saveMsg.innerHTML = "Post loaded!";
        $(saveMsg).fadeIn();
        setTimeout(function () {
            $(saveMsg).fadeOut();
        }, 3000);
    }

    function save(slot, name) {
        localStorage.setItem("BLAEOPS_slot" + slot, postTextarea.value);
        if (slot >= 4) {
            saveMsg.innerHTML = "Post autosaved!";
        } else {
            saveMsg.innerHTML = "Post saved!";
        };
        localStorage.setItem("BLAEOPS_slotname" + slot, name);
        $(saveMsg).fadeIn();
        setTimeout(function () {
            $(saveMsg).fadeOut();
        }, 3000);
        updateNames();
    }

    function updateNames() {
        document.querySelectorAll("[data-blaeops_slot]").forEach(function (item) {
            if (localStorage.getItem("BLAEOPS_slotname" + item.dataset.blaeops_slot)) {
                item.querySelector(".BLAEOPS_slotsavename").innerHTML = localStorage.getItem("BLAEOPS_slotname" + item.dataset.blaeops_slot);
            }
        });
    }

    loadBtn.querySelectorAll("[data-blaeops_slot]").forEach(function (link) {
        link.onclick = function () {
            triggerLoadModal(link.dataset.blaeops_slot);
        }
    });
    saveBtn.querySelectorAll("[data-blaeops_slot]").forEach(function (link) {
        link.onclick = function () {
            triggerSaveModal(link.dataset.blaeops_slot);
        }
    });

    previewBtn.addEventListener("click", function () { // Trigger autosave when clicking preview button
        var time = new Date();
        save(4, time.toLocaleString());
    });

    postTextarea.addEventListener("input", function handler(e) { // Trigger autosave every 3 minutes, starting from the point when user types something into the post textarea
        setInterval(function () {
            var time = new Date();
            save(4, time.toLocaleString());
        }, 180000)
        e.currentTarget.removeEventListener("input", handler)
    });

    window.addEventListener("beforeunload", function () { // Trigger exitsave when closing page, do not save if post is empty
        var time = new Date();
        if (postTextarea.value) {
            save(5, time.toLocaleString());
        }
    });
    updateNames();

})();