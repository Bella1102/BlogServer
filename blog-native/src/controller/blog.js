
const xss = require('xss')
const { exec } = require('../db/mysql')

// 先返回假数据（格式是正确的）
//    return [
//     {
//         id: 1,
//         title: "titleA",
//         content: "contentA",
//         createTime: 1569737591027,
//         author: "bella"
//     }
// ];

// 获取博客list
const getList = (author, keyword) => {
    // 1=1 防止没有where条件的情况下报错
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`;
    // 返回promise
    return exec(sql);
 
};

// 获取博客详情页
const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}'`;
    return exec(sql).then(rows => {
        return rows[0];
    });
};

// 创建一个新博客
const newBlog = (blogData = {}) => {
    // blog Data 是一个博客对象，包含title，content等
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createtime = Date.now()
    const sql = `insert into blogs(title, content, createtime, author) 
                values ('${title}', '${content}', ${createtime}, '${author}');`

    return exec(sql).then(insertData => {
        //console.log('insertData is: ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

// 更新博客
const updateBlog = (id, blogData = {} ) => {
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const createtime = Date.now()
    const sql = `update blogs set title='${title}', content='${content}' where id=${id};`

    return exec(sql).then(updateData => {
        //console.log('updateData is:', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })  
}

// 删除博客
const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        //console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = { 
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}


