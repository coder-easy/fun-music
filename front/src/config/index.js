const isDev = process.env.NODE_ENV === "development";

const common = {

};

const dev = {
    socketUrl: "http://localhost:3000"
};

const prod = {

};

export default {
    ...common,
    ...(isDev ? dev : prod)
}