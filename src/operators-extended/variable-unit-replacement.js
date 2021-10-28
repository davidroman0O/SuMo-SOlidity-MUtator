const Mutation = require('../mutation')

function VUROperator() {}

VUROperator.prototype.ID = 'VUR'
VUROperator.prototype.name = 'variable-unit-replacement'

VUROperator.prototype.getMutations = function(file, source, visit) {
  const mutations = []
  var prevRange;

   visit({
    NumberLiteral: (node) => {
      if(node.subdenomination){
        if(prevRange != node.range){
          const start = node.range[0]
          const end = node.range[1]
          var replacement = source.slice(start, end + 1)

          switch (node.subdenomination) {
            //VURe - Ether Units Replacement
            case 'wei':
              replacement = replacement.replace('wei','ether')
              break;
            case 'ether':
              replacement = replacement.replace('ether','wei')
              break;
            //VURt - Time Units Replacement
            case 'seconds':
              mutations.push(new Mutation(file, start, end + 1, 'minutes'))  
            mutations.push(new Mutation(file, start, end + 1, 'hours'))
              mutations.push(new Mutation(file, start, end + 1, 'days'))
              mutations.push(new Mutation(file, start, end + 1, 'weeks'))
              mutations.push(new Mutation(file, start, end + 1, 'years'))
              break;
            case 'minutes':
              mutations.push(new Mutation(file, start, end + 1, 'seconds'))
              mutations.push(new Mutation(file, start, end + 1, 'hours'))
              mutations.push(new Mutation(file, start, end + 1, 'days'))
              mutations.push(new Mutation(file, start, end + 1, 'weeks'))
              mutations.push(new Mutation(file, start, end + 1, 'years'))
              break;
            case 'hours':
              mutations.push(new Mutation(file, start, end + 1, 'seconds'))
               mutations.push(new Mutation(file, start, end + 1, 'minutes'))
               mutations.push(new Mutation(file, start, end + 1, 'days'))
               mutations.push(new Mutation(file, start, end + 1, 'weeks'))
               mutations.push(new Mutation(file, start, end + 1, 'years'))
              break;
            case 'days':
              mutations.push(new Mutation(file, start, end + 1, 'seconds'))
               mutations.push(new Mutation(file, start, end + 1, 'minutes'))
               mutations.push(new Mutation(file, start, end + 1, 'hours'))
               mutations.push(new Mutation(file, start, end + 1, 'weeks'))
               mutations.push(new Mutation(file, start, end + 1, 'years'))
              break;
            case 'weeks':
              mutations.push(new Mutation(file, start, end + 1, replacement = replacement.replace('weeks','seconds')))  
              mutations.push(new Mutation(file, start, end + 1, replacement = replacement.replace('weeks','minutes')))  
              mutations.push(new Mutation(file, start, end + 1, replacement = replacement.replace('weeks','hours')))  
              mutations.push(new Mutation(file, start, end + 1, replacement = replacement.replace('weeks','days')))  
              mutations.push(new Mutation(file, start, end + 1, replacement = replacement.replace('weeks','years')))  
              break;
            case 'years':
               mutations.push(new Mutation(file, start, end + 1, 'seconds'))
               mutations.push(new Mutation(file, start, end + 1, 'minutes'))
               mutations.push(new Mutation(file, start, end + 1, 'hours'))
               mutations.push(new Mutation(file, start, end + 1, 'days'))
               mutations.push(new Mutation(file, start, end + 1, 'weeks'))
            }
        
        }
        prevRange = node.range;
      }
    }
  })
  return mutations
}

module.exports = VUROperator
