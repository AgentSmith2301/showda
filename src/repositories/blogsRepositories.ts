import { BlogInputModel, BlogViewModel, allDB } from '../types/dbType';

export const metodsBlogsDB = {
    checkId(id: string) {
        const result = allDB.blog.find((value) => value.id === id);
        if(result) {
            return true
        } else {
            return false
        }
    },
    getAll() {
        return allDB.blog;
    },
    deleteAll() {
        allDB.blog = [];
    },
    getBlog(id: string) {
        const result = allDB.blog.find((value) => value.id === id);
        return result;
    },
    updateBlog(id: string, blog: BlogInputModel) {
        let findElement = allDB.blog.find((value) => value.id === id);
        if(findElement !== undefined) {
            findElement.name = blog.name;
            findElement.description = blog.description;
            findElement.websiteUrl = blog.websiteUrl;
            return true
        } else {
            return false
        }
        
    }, 
    createBlog(blog: BlogInputModel): BlogViewModel {
        const id = Date.now().toString();
        const essence = {
            id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        allDB.blog.push(essence)
        return essence;
    },
    deleteBlog(id: string) {
        let result = allDB.blog.findIndex((value) => value.id === id);
        console.log(result, 'result')
        if(result > -1) {
            allDB.blog.splice(result, 1)
            return true
        } else {
            return false
        }
    }
}
