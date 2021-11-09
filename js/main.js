const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
//thay đổi màu nền
renderer.setClearColor(0xb7c3f3, 1);

//thêm ánh sáng xung quanh
const light = new THREE.AmbientLight( 0xffffff); // soft white light
scene.add( light );

//toạ biến toàn cục global varable
const start_postion = 4
const end_postion = -start_postion
const text = document.querySelector(".text")
const TIME_LIMIT = 10
let gameStatus = "loading"
//kiểm tra búp bê có quay lại không
let isLookingBackward = true
//tạo khối
function createCube(size, postionX, rotY = 0, color = 0xfbc851){
    //sử dụng hình học
    const geometry = new THREE.BoxGeometry(size.w,size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = postionX;
    cube.position.y = rotY;
    scene.add( cube );
    return cube;
}
//khoảng cách từ camera đến ...
camera.position.z = 6;
alert("Welcome to website TIENDATFE")
//thêm vật, cảnh...
// Instantiate a loader
const loader = new THREE.GLTFLoader();
//tạo hàm delay
function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

//create class Doll
class Doll{
    constructor()
    {
        // gọi hàm loader để tải ảnh 3d
        loader.load("../model/scene.gltf",(gltf) =>
        {
            scene.add(gltf.scene);
            //chỉnh size búp bê
            gltf.scene.scale.set(0.4,0.4,0.4);
            //khoảng cách ảnh 3d theo trục x,y,z
            gltf.scene.position.set(0, -1, 0);
            this.doll = gltf.scene;
        })
    }
    lookBackward(){
        gsap.to(this.doll.rotation, { y: -3.15,duration: .45})
        setTimeout(() => isLookingBackward = true, 150)
    }
    lookForward(){
        gsap.to(this.doll.rotation, { y: 0,duration: .45})
        setTimeout(() => isLookingBackward = false, 450)
    }
    //búp bê nhìn sau
    // lookBackward(){
    //     // this.doll.rotation.y = -3.15
    //     //búp bê xoay từ 0 -> -3.15
    //     gsap.to(doll.rotation, {duration: .45, y: -3.15})
    //     // setTimeout(() => dallFacingBack = true, 150)
    // }
    //búp bê nhìn về trước
    // lookForward(){
    //     // this.doll.rotation.y = 0
    //     gsap.to(doll.rotation, {duration: .45, y: 0})
    //     // setTimeout(() => dallFacingBack = false, 450)
    // }
    //búp bê nhìn về trước 1 lúc và sau 1 lúc
    async start(){
        this.lookBackward()
        await delay((Math.random() * 1500) + 1500)
        this.lookForward()
        await delay((Math.random() * 750) + 750)
        this.start()
    }
}
//tạo đường đi cho người chơi
function createTrack(){
    //hình dáng khối cude
    createCube({w: start_postion * 2 + .2, h: 1.5, d: 1}, 0, 0,0xe5a716).position.z = -1;
    createCube({w: .2, h: 1.5, d: 1}, start_postion, -0.01);
    createCube({w: .2, h: 1.5, d: -1}, end_postion, .01);
    
}
createTrack()

//class player
class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( 0.3, 32, 16 );//hình cầu
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = 1
        sphere.position.x = start_postion
        scene.add( sphere );
        this.player = sphere
        //thông tin người chơi
        this.playerInfo = {
            positionX: start_postion,
            velocity: 0 //tốc độ người chơi
        }

    }
    run(){
        this.playerInfo.velocity = .03
    }
    //stop
    stop(){
        // this.playerInfo.velocity = 0
        gsap.to(this.playerInfo, {velocity: 0, duration: .1})
    }
    // check lose win
    check(){
        if(this.playerInfo.velocity > 0 && !isLookingBackward){
            alert("Bạn đã bị bắn!! HAHAHAHAHa")
            gameStatus = "over"
        }
        if(this.playerInfo.positionX < end_postion){
            alert("Chúc mừng bạn đã qua mặt được nó :))")
            gameStatus = "over"
        }
    }
    //cập nhật trạng thái player
    update(){
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }
}

//khởi tạo player
const player = new Player()
//khởi tạo doll
let doll = new Doll()

//init
async function init(){
    await delay(600)
    text.innerText = "dùng phím mũi tên lên để di chuyển"
    await delay(1500)
    text.innerText = "Sẽ bắt đầu trong 3s"
    await delay(600)
    text.innerText = "Sẽ bắt đầu trong 2s"
    await delay(600)
    text.innerText = "Sẽ bắt đầu trong 1s"
    await delay(600)
    text.innerText = "Gooo!!!"
    startGame()
}
//
function startGame(){
    gameStatus = "started"
    let progressBar = createCube({w: 15,h: .1,d: 1}, 0)
    progressBar.position.y = 4.15
    gsap.to(progressBar.scale,{x: 0, duration: TIME_LIMIT, ease: "none"})
    doll.start()
    setTimeout(() =>{
        if(gameStatus != "over"){
            text.innerText = "Hết thời gian!"
            gameStatus ="over"
        }
    }, TIME_LIMIT * 1400);
}
init()



function animate() {
    if(gameStatus == "over") return
    renderer.render( scene, camera );
	requestAnimationFrame( animate );//kết xuất đồ hoạ
    //khối lập phương xoay theo trục x,y,z(0.01 tốc độ quay)
    //cube.rotation.y += 0.01;
    //gọi hàm update
    player.update()
}
animate();
//thay đổi màn hình thì khung hình game thay đổi theo
window.addEventListener( 'resize', onWindowResize, false )
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
}
//di chuyển 
window.addEventListener('keydown', function(event){  
    if (gameStatus != "started") return;
    if (event.key == "ArrowUp") {
        player.run()
    }
})
//dừng lại bàng phím mũi tên
window.addEventListener('keyup', (e) =>{
        if (e.key == "ArrowUp") {
            player.stop()
        }
})