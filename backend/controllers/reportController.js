const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs");

/*
 *  @desc   export all tasks as an excel file
 *  @route  GET /api/reports/export/tasks
 *  @access private (Admin)
 */
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignTo", "name email");
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "Priority", width: 15 },
      { header: "Status", key: "Status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Description",
      'attachment; filename="tasks_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error exporting tasks", error: error.message });
  }
};

/*
 *  @desc   export user-task report as an excel file
 *  @route  GET /api/reports/export/users
 *  @access private (Admin)
 */
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Tasks Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Task", key: "taskCount", width: 20 },
      { header: "Pending Task", key: "pendingTasks", width: 20 },
      { header: "In Progress Task", key: "inProgressTasks", width: 20 },
      { header: "Completed Task", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Description",
      'attachment; filename="users_report.xlsx"'
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error exporting tasks", error: error.message });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
