const {Device, DeviceInfo} = require('./../models/models.js')
const ApiError =require('./../erorr/ApiEror.js');
const uuid = require('uuid');
const path = require('path');
const { log } = require('console');

class DeviceController {

    async create(req, res, next) {
 
            try{
                const {name, price, brandId, typeId} = req.body;
                let {info} = req.body;
                const {img} = req.files;
                let fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..','static', fileName));
                const device = await Device.create({name, price, brandId, typeId, img:fileName});

                if(info){
                    info = JSON.parse(info);
                    info.forEach(i => 
                         DeviceInfo.create({
                            title:i.title,
                            deviceId: device.id
                        })
                        )
                }

                return res.json(device);

            }catch(e){
                next(ApiError.bedRequest(e.message))
            }
 
          

        }

    async getAll(req, res) {

         let device;
         const {brandId, typeId,limit, page} = req.query;
       
        const page1  = page  || 1;
       const  limit2 = limit || 9;
        let offset = page1 * limit2 - limit2; 

         if(!brandId && !typeId){

           device = await Device.findAndCountAll({limit: limit2, offset});
         }
         if(brandId && !typeId){
            device = await Device.findAndCountAll({where:{brandId}, limit: limit2, offset});
         }

         if(!brandId && typeId){
            device = await Device.findAndCountAll({where:{typeId}, limit: limit2, offset});
         }

         if(brandId && typeId){
            device = await Device.findAndCountAll({where:{brandId, typeId}, limit: limit2, offset});
         }
         return res.json(device)
    }
  
    async getOne(req, res) {
        const {id} = req.params;
        const device = await Device.findOne({
            where:{id},
            include: [{model:DeviceInfo, as:'info'}]
        })
        return res.json(device);
    }
}

module.exports = new DeviceController();