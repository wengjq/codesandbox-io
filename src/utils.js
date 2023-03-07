const LZString = require("lz-string");
const schedule = require("node-schedule");
const jsonfile = require("jsonfile");
const moment = require("moment");

const runSchedule = (filePath) => {
  // 定义规则
  const rule = new schedule.RecurrenceRule();
  // 周五的 18 点执行
  rule.dayOfWeek = [5];
  rule.hour = [18];
  rule.minute = 0;
  rule.second = 0;
  
  // 启动任务
  const scheduleJob = schedule.scheduleJob(rule, () => {
    console.log("codesandbox-io------开始定时任务");
    jsonfile
    .readFile(filePath)
    .then(filesObj => {
      if (Object.keys(filesObj).length) {
        Object.keys(filesObj).forEach(key => {
          const startDate = moment(filesObj[key].date, "YYYY-MM-DD HH:mm:ss");
          const endDate = moment(Date.now());
          const duration = endDate.diff(startDate, "days");
          console.log(startDate, endDate, duration);
          // 时间大于两周的数据删除
          if (duration > 14) {
            delete filesObj[key];
          }
          jsonfile.writeFileSync(filePath, filesObj, { spaces: 2, EOL: "\r\n" });
        });
        console.log("codesandbox-io------定时任务结束");
      }
    });
  });

  return scheduleJob;
}

const randomString = () => {
  const str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 6; i > 0; i--) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  return result;
}

const decompress = (string) =>
  LZString.decompressFromBase64(
    string
      .replace(/-/g, "+") // Convert '-' to '+'
      .replace(/_/g, "/") // Convert '_' to '/'
  );

  module.exports = {
    runSchedule: runSchedule,
    randomString: randomString,
    decompress: decompress
  }