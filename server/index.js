import Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";
import koaStatic from "koa-static";
import path from "path";

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
    cors: true
});

app.use(koaStatic(path.resolve("./static")));

app.use(async (ctx,next)=>{
  if(ctx.path=='/'){
    ctx.redirect('/public/index.html');
  }
  await next()
})

const userList = [];

io.on("connection", (socket) => {
    console.log(socket.id, "链接成功");

    socket.on("upline", (args) => {
        const user = {
            id: socket.id,
            user: args.user,
            uptime: Date.now()
        };
        userList.push(user);

        io.emit("has-upline", user);
    });

    socket.on("music", (args) => {
        console.log("接收到新音乐，将进行广播: ", args);
        io.emit("new-music", args);
    });

    socket.on("danmaku", (args) => {
        console.log("接收到新弹幕，将进行广播: ", args);
        io.emit("new-danmaku", args);
    });
});

io.on("disconnect", (socket) => {
    const user = userList.find(i => i.id == socket.id);
    if (user) {
        io.emit("new-offline", {
            ...user,
            offtime: Date.now()
        });
    }
});


setInterval(() => {
    io.emit("new-danmaku", "气氛组弹幕来啦～～～～～～～～～");
}, 1000);

httpServer.listen(3000);