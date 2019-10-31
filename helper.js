const fs = require('fs');
const path = require('path');
const Emitter = require('events').EventEmitter;
const chalk = require('chalk')

const filePath = path.join(__dirname, './static/data.json')

// readfile
class CarServ extends Emitter {
    constructor() {
        super();
        //add
        this.on('add', (carData) => {
            CarServ.argv = carData;
            if (fs.existsSync(filePath)) { // create a car even unless .json file isn't exist
                this.recordInit(carData);
            } else {
                this.fileWriter();
                this.recordInit(carData);
            }
        })
        //read
        this.on('show', (...carData) => {
            const cars = this.fileReader();// fileReade -> Promise
            cars.then(res => {
                if(carData[0] && carData[1]) {
                    res = res.filter(({car, kind}) => car === carData[0] && kind === carData[1]);                    
                } else if(carData[0]) {
                    res = res.filter(({car}) => car === carData[0])
                } 
                if (!res.length) console.log(chalk.red('\t NOT FOUND ANY CONSILIENCE'))
                console.log(chalk.green('\t ALL EXISTING CARS \n'),res)
            }).catch (res => console.log(res))
        })
        //update
        this.on('update', (carData) => {
            const cars = this.fileReader();
            cars.then(res => {
                const car = res.find(({car, kind}) => car === carData.car && kind === carData.kind);// was found only first occurrence
                if(car) {
                    if(carData.doors) {
                        car.doors = carData.doors
                    }
                    car.color = carData.color;
                    this.fileWriter('\t YOU APDATED THE ITEM SUCCESSFULLY', res)
                } else console.log(chalk.red('NOT SUCH FOUND ANY ITEM FOR UPDATE'))
               
            }).catch (err => console.log(err))
        })
        //delete
        this.on('delete', (carData) => {
            const cars = this.fileReader();
            cars.then(res => {
                const length = res.length
                res = res.filter(({car, kind}) => carData.car !== car && carData.kind !== kind);
                if(length === res.length) {
                    console.log(chalk.red('\t NO FOUND A CAR FOR DELETING !!!'));
                } else this.fileWriter('\t YOU DELETED THE ITEM SUCCESSFULLY !!!', res)
                
            }).catch (err => console.log(err))
        })
    }

    recordInit(carData, flag = '') {
        const cars = this.fileReader(); // fileReader returns the Promise
                cars.then(res => {
                res.push(carData)
                this.fileWriter(flag || "\t CREATED !!!", res)
            }).catch (err => this.recordInit(carData, "\t FIRST RECORD ADDED !!!"))
    }

    fileReader() {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, content) => {
                if (err) {
                    console.log(err.name)
                } else {
                    try {
                        const cars = JSON.parse(content);
                        resolve(cars);
                    }
                    catch (error) {
                        reject(error.message);
                        this.fileWriter();
                    }
                }
            })
        })
    };

    fileWriter(message='', cars = []) {
        fs.writeFile(filePath, JSON.stringify(cars, null, 2), { flag: 'w+' }, (err) => {
            if (err) {
                console.log(err.name)
            } else console.log(chalk.green(message || '\t YOUR FILE CREATED AND ADDED FIRST RECORD.'))
        });
    }
}
module.exports = new CarServ();
