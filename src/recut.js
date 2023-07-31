import react from "react"
let simpleValues = {}
let simpleRenders = {}
let customTests = []
let customValues = []
let customRenders = []
let slices = {
    "listen": function(test, render) {
        if (typeof test === "string") {
            react.useState(function() {
                if (simpleRenders[test]) {
                    simpleRenders[test].push(render[1])
                } else {
                    simpleValues[test] = slices[test]
                    simpleRenders[test] = [render[1]]
                }
            })
            return slices[test]
        } else {
            let result = test(slices)
            react.useState(function() {
                customTests.push(test)
                customValues.push(result)
                customRenders.push(render[1])
            })
            return result
        }
    },
    "dispatch": function(name, value) {
        if (value !== undefined) {
            simpleValues[name] = value
        }
        if (slices[name] !== simpleValues[name]) {
            slices[name] = simpleValues[name]
            for (let index in simpleRenders[name]) {
                simpleRenders[name][index]({})
            }
            for (let index in customRenders) {
                let result = customTests[index](slices)
                if (customValues[index] !== result) {
                    customValues[index] = result
                    customRenders[index]({})
                }
            }
        }
        return slices[name]
    }
}
export default slices