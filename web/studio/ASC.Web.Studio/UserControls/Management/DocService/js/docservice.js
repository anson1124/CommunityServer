/*
 *
 * (c) Copyright Ascensio System Limited 2010-2015
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


jq(function () {
    jq("#docServiceButtonSave").click(function () {
        var docServiceUrlApi = jq("#docServiceUrlApi").val();
        var docServiceUrlCommand = jq("#docServiceUrlCommand").val();
        var docServiceUrlStorage = jq("#docServiceUrlStorage").val();
        var docServiceUrlConverter = jq("#docServiceUrlConverter").val();

        jq("#docServiceBlock").block();
        DocService.SaveUrls(docServiceUrlApi, docServiceUrlCommand, docServiceUrlStorage, docServiceUrlConverter, function (result) {
            if (result.error != null) {
                toastr.error(result.error.Message);
            }
            jq("#docServiceBlock").unblock();
        });
    });

    jq(document).on("click", "#docServiceButtonTest:not(.disable)", function () {
        TestDocService();
    });
});

var TestDocServiceAPI = function () {
    var testResult = function () {
        var result = typeof DocsAPI != "undefined";

        jq("#docServiceUrlApi").toggleClass("complete-input", result).data("done", true);
        checkTestDocServiceDone();
    };

    delete DocsAPI;
    testResult();
    jq("#docServiceUrlApi").data("done", false);

    jq("#scripDocServiceAddress").remove();

    var js = document.createElement("script");
    js.setAttribute("type", "text/javascript");
    js.setAttribute("id", "scripDocServiceAddress");
    document.getElementsByTagName("head")[0].appendChild(js);

    var scriptAddress = jq("#scripDocServiceAddress");

    scriptAddress.load(testResult).error(testResult);

    var docServiceUrlApi = jq("#docServiceUrlApi").val();

    scriptAddress.attr("src", docServiceUrlApi);
};


var TestDocServiceCommand = function () {
    TestDocServiceInput("docServiceUrlCommand");
};
var TestDocServiceStorage = function () {
    TestDocServiceInput("docServiceUrlStorage");
};
var TestDocServiceConverter = function () {
    TestDocServiceInput("docServiceUrlConverter");
};

var TestDocServiceInput = function (inputId) {
    jq("#" + inputId).removeClass("complete-input").data("error", false).data("done", false);

    var docServiceUrlStorage = jq("#" + inputId).val();
    if (!docServiceUrlStorage.length) {
        jq("#" + inputId).data("error", true).removeClass("complete-input").data("done", true);
        checkTestDocServiceDone();
        return;
    }

    jq.ajax({
        type: "get",
        url: docServiceUrlStorage,
        complete: function () {
            jq("#" + inputId).toggleClass("complete-input", !jq("#" + inputId).data("error")).data("done", true);
            checkTestDocServiceDone();
        },
        error: function () {
            jq("#" + inputId).data("error", true);
        }
    });
};

var checkTestDocServiceDone = function () {
    if (jq("#docServiceUrlApi").data("done")
        && jq("#docServiceUrlCommand").data("done")
        && jq("#docServiceUrlStorage").data("done")
        && jq("#docServiceUrlConverter").data("done")) {
        jq("#docServiceButtonTest").removeClass("disable");
    }
};

var TestDocService = function () {
    jq("#docServiceButtonTest").addClass("disable");
    TestDocServiceAPI();
    TestDocServiceCommand();
    TestDocServiceStorage();
    TestDocServiceConverter();
};