# ClipHop
Utility app to synchronize clipboards across multiple devices on the same local network 
## Development 
**Built using the following frameworks & technologies:**
- [React](https://react.dev/) & [TailwindCSS](https://tailwindcss.com/) (Frontend UI)
- [Node.js](https://nodejs.org/en) (Backend server)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) (Bidirectional network communication)
- AWS Amplify, EC2, ALB, API Gateway (Hosting & Deployment)
- Nginx Reverse Proxy

**In addition, the following libraries were used in the development of the app:**
- React [dnd kit](https://dndkit.com/) (handles device drag & drop interactions)
- [unique-names-generator](https://github.com/andreasonny83/unique-names-generator) (generates human-readable names to distinguish devices)
- [ws](https://github.com/websockets/ws) (Node.js library used to simplify the creation of the WebSocket Server)

## How To Use
1. Open the [ClipHop](https://www.cliphop.net/) website on every device whose clipboard you want to sync with other devices. Each device connected to the app on your **local network** will be shown on the UI
2. Drag and drop devices on top of each other to form **Sync Groups**, a group of devices whose clipboards will be automatically synchronized by the app. It is useful to think of the devices in these groups as having one shared clipboard. You can have multiple Sync Groups, each with as many devices as you want!
3. Click the UPDATE button to update the shared clipboard of the group your device is in, and click the SYNC button to copy the updated group clipboard to your device. A **RED** SYNC button means there are updates to the group clipboard that this device has not yet copied over, so SYNC should be clicked. A **GREEN** SYNC button means this device's clipboard is up-to-date with the current group clipboard. Note that clicking UPDATE on a device causes a RED SYNC button for all other devices in the same group and dragging a device/group onto another device/group causes a RED SYNC button for the device that is dragged. 
   

## FAQs
1. **What happens behind the scenes?**  
   Every time a device connects to the app, it forms a WebSocket connection with the app's WebSocket Server (hosted at *ws.cliphop.net*). This server handles all UI updates and clipboard sharing    across devices in the local network. When a group's clipboard is updated, this information passes to the server which then relays it to all the other devices in the same group. 
2. **What about privacy? Is my information shared with any third parties?**
3. **How can I be sure my information is secure?**
   
   
   


## Report Bugs/Give Feedback
This app is a pet project of mine, and I try to actively maintain it whenever I'm free. There are still some edge cases I haven't gotten around to handling and a non-trivial set of bugs I'm sure the app contains that I'm not aware of. If you find a problem in the app or simply want to provide feedback about the UI or functionality in general, feel free to [DM me on Twitter/X](https://twitter.com/messages/compose?recipient_id=1269431990731882496)
