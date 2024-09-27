import {useState, useMemo} from "react";
// List of colors used for groups
const colors = ['bg-emerald-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-violet-500'];

// Generates positions for device groups based on the number of groups
function generatePositions(numGroups,width) {
    let radius = width >= 768 ? 13 : Number(((13/35)*width/16).toFixed(2))
    let originShift = width >= 768 ? 13.5 : Number(((11.5/35)*width/16).toFixed(2))
    let positions = [];
    if (numGroups === 1) {
        positions.push([originShift.toString(),originShift.toString()]);
    } else if (numGroups >= 1) {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + originShift).toString(),
                (originShift-Math.round(radius*Math.sin(i*theta))).toString()]);
        }
    }
    return positions;
}

function useDevices() {
    const [thisDevice,setThisDevice] = useState({
        name:"",
        type:"",
        id:1,
        syncButtonColor:'green'
    });
    const [deviceGroups, setDeviceGroups] = useState([])

    /*
        deviceGroups state handlers
    */
    // Adds new device groups based on the provided device list
    const addGroups = (deviceList) => {
        let newDeviceGroups = [];
        let groupsMap = new Map();
        let maxId = 0
        deviceList.forEach(device => {
            if (!groupsMap.has(device.groupId)) {
                groupsMap.set(device.groupId, []);
            }
            groupsMap.get(device.groupId).push({ name: device.name, type: device.type });
            maxId = Math.max(maxId, device.groupId);
        });

        for (let i=1; i <= maxId; ++i) {
            if (groupsMap.has(i)) {
                let groupDeviceList = groupsMap.get(i)
                newDeviceGroups.push({id:i, color:colors[i-1], devices:groupDeviceList, bubble:groupDeviceList.length > 1})
            }
        }
        setDeviceGroups(newDeviceGroups);
    }

    // Adds a new device to the device groups
    const addDevice = (newId, name,type) => {
        setDeviceGroups(deviceGroups => {
            let newDeviceGroups = [...deviceGroups, {id:newId, color:colors[newId-1], devices:[{name:name,type:type}], bubble:false}].sort((a,b) => (a.id-b.id))
            return newDeviceGroups
        });
    };

    // Merges two device groups into one
    const mergeGroups = (id1,id2) => {
        setDeviceGroups(deviceGroups => {
            let updatedGroups = [];
            for (let group of deviceGroups) {
                if (group.id === id2) {
                    const group1 = deviceGroups.find(g => g.id === id1);
                    const mergedDevices = [...group.devices, ...group1.devices];
                    updatedGroups.push({...group, devices: mergedDevices, bubble:mergedDevices.length > 1});
                } else if (group.id !== id1) { // Skip group id1 since it will be merged later
                    updatedGroups.push(group);
                }
            }
            return updatedGroups
        });
    }

    // Removes a device by name from the deviceGroups state
    const removeDevice = (name) => {
        setDeviceGroups(deviceGroups => {
            let acc = []
            for (let group of deviceGroups) {
                let newDevices = group.devices.filter((device) => device.name !== name);
                if (newDevices.length > 0) {
                    acc.push({...group,devices:newDevices})
                }
            }
            return acc
        });
    }

    const deviceDragOver = (event) => {
        if (event.over == null || event.over.id === event.active.id) {
            setDeviceGroups(deviceGroups.map((group) => {return {...group,color:colors[group.id-1],bubble:group.devices.length > 1}}))
        } else {
            setDeviceGroups(deviceGroups.map((group) => {
                if (group.id === event.active.id) {
                    return {...group,color:colors[event.over.id-1],bubble:group.devices.length > 1}
                } else if (group.id === event.over.id) { 
                    return {...group,color:colors[event.over.id-1],bubble:true}
                } else {
                    return {...group,color:colors[group.id-1],bubble:group.devices.length > 1}
                }
            }))
        }
    }

    // Generates positions for the device groups based on their count
    const positions = useMemo(() => {
        return deviceGroups ? generatePositions(deviceGroups.length,window.innerWidth) : []
    }, [deviceGroups])


    return {thisDevice,setThisDevice,deviceGroups,addGroups,addDevice,mergeGroups,removeDevice,deviceDragOver,positions}
}

export default useDevices