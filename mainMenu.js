const { dialog, Menu } = require("electron");


const mainMenu = (callback, ...args) => {
  let param = [...args]
  return Menu.buildFromTemplate([
    {
      label: "Electron",
      submenu: [
        { label: "Item 1" },
        { label: "Item 2", submenu: [{ label: "Sub Item 1" }] },
        { label: "Item 3" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "Actions",
      submenu: [
        {
          label: "DevTools",
          role: "toggleDevTools",
        },
        {
          role: "toggleFullScreen",
        },
        {
          label: "Greet",
          click: () => {
            console.log("自定义动作Hello from Main Menu", param);
            const answers = ["Yes", "No", "Maybe"];
            callback("点击完毕")
            dialog
              .showMessageBox({
                title: "Message Box",
                message: "Please select an option",
                detail: "Message details.",
                buttons: answers,
              })
              .then(({ response }) => {
                console.log(`User selected: ${answers[response]}`);
              });
          },
          accelerator: "Shift+Alt+G",
        },
      ],
    },
  ]);

};

module.exports = mainMenu;
