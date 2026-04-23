import { BlogInputModel, BlogViewModel } from '../types/dbType';
// import {blogsCollection} from '../../db/mongoDb'
import {Blogs} from '../infrastructure/model/blogs-model'
import {injectable, inject } from 'inversify'; 

@injectable() // помечаем класс как injectable, чтобы его можно было внедрить в другие классы
export class BlogsRepositories {
    // нужно внедрить зависимость модели блога через конструктор для того, что бы не было жесткой связи с конкретной реализацией модели 
    // и можно было легко заменить ее на другую , так же в composition root нужно будет зарегистрировать эту зависимость 
    async checkId(id: string): Promise<BlogViewModel | null> {
        const result = await Blogs.findOne({id});
        return result
    }
    
    async deleteAll(): Promise<void> {
        const result = await Blogs.deleteMany({});
        result
    }

    async updateBlog(id: string, updateData: BlogInputModel) {
        const result = await Blogs.updateOne({id},{ $set: {...updateData} });
        return result
    }

    async createBlog(data: BlogViewModel): Promise<BlogViewModel> {
        try{
            const result = await Blogs.create(data);
            return {
                id: result.id,
                name: result.name,
                description: result.description,
                websiteUrl: result.websiteUrl,
                createdAt: result.createdAt,
                isMembership: result.isMembership,
            }
        } catch(error) {
            console.log('❌ Ошибка создания блога:', error); // логирование ошибки
            throw error; // пробрасываем ошибку дальше
        }
    }

    async deleteBlog(id: string) {
        const result = await Blogs.deleteOne({id});
        return result
    }
}