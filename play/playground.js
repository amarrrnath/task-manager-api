require("../src/db/mongoose");
const Task = require("../src/models/task");

const deleteAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: true});
    return count;
}

deleteAndCount("5e16a24b2ab965346c5204b5").then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e)
})