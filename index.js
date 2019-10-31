const yargs = require('yargs');
const carServe = require('./helper');
const chalk = require('chalk')

yargs.option({
    car: { type: 'string', describe: 'car name' },
    kind: { type: 'string', describe: 'car issue name' },
    color: { type: 'string', describe: 'car color' },
    doors: { type: "number", describe: 'the count of existing doors' }

})
// create
const argv = yargs.command({
    command: 'add <car> <kind> [color] [doors]',
    aliases: ['config', 'cnf'],
    desc: 'Set a config variable',
    builder: (yargs) => {
        yargs
            .default('color', 'black')
            .default('doors', 4)
            .positional('car', { // doesn't use, written for example
                default: 'Volga'
            })
            .positional('kind', {
                default: '31/10'
            })
    },
    handler: ({car, kind, color, doors}) => {
        carServe.emit('add', {car, kind, color, doors})
    }
}) // read
    .command({
        command: 'show [car] [kind]',
        aliases: ['view', 'ls'],
        desc: 'show car\'s information',
        handler: ({car, kind}) => {
            carServe.emit('show', car, kind)
        }
    })
    // update
    .command({
        command: 'update <car> <kind> [color] [doors]',
        aliases: ['up', 'u'],
        desc: 'update car\'s parameters',
        handler: ({car, kind, color, doors}) => {
            if(!(color && doors)) {
                console.log(chalk.red(`\t YOU NEED TO ENTRY ANI PARAMS (${chalk.italic('color or doors')})`))
            } else{
                carServe.emit('update', {car, kind, color, doors})
            }
        }
    })
    // delete
    .command({
        command: 'delete <car> <kind>',
        aliases: ['del', 'd'],
        desc: 'delete specified car',
        handler: ({car, kind}) => {
            carServe.emit('delete', {car, kind})
        }
    })
    .help()
    .argv
//   console.log(argv)