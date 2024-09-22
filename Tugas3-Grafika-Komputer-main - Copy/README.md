
## Tugas Individu 3 - 3D WebGl

## Membuat Objek 3D Geometry

### 1. Cube

Membuat bentuk cube 3D dengan warna yang berbeda - beda di tiap sisinya. Cube tersebut terdiri dari enam sisi yang diberi warna berbeda: sisi depan ungu, belakang hitam, atas merah, bawah kuning, kiri biru, dan kanan pink. Kubus berotasi secara dinamis di sumbu X, Y, dan Z. Script untuk menginisialisasi konteks WebGL, mendefinisikan geometri dan warna kubus, serta mengatur shader untuk rendering.

### 2. Cone 

Membuat bentuk cone 3D dengan warna rainbow. Cone dibentuk menggunakan vertices sebagai titik-titik yang mendefinisikan posisi kerucut, termasuk pusat dasar dan titik puncak. Cone juga berotasi di sumbu xyz agar lebih menarik.

### 3. Cylinder

Membuat bentuk cylinder berwarna merah-kuning yang didefinisikan oleh radius, tinggi, dan jumlah segmen, dan melingkar. Silinder dianimasikan untuk berputar terus-menerus di sekitar sumbunya agar interaktif.

### 4. Ball

Membuat bentuk bola / sphere 3D yang dirender menggunakan WebGL. Bola dibuat dengan radius dan dibagi menjadi grid lintang dan bujur untuk menghasilkan vertex dan warna.Bola berotasi di sumbu X Y Z. Vertex dan fragment shader menangani proses rendering, menerapkan warna gradien pada permukaan bola.

### 5. Ring

Membuat ring 3D dengan menggunakan shader untuk mengatur canvas untuk rendering, menghitung posisi dan warna vertice ring, dan rotasi ring di sekitar sumbu X, Y, dan Z. Warna ring dibuat menyerupai glazed donut.

## Membuat 3D Lathe 

Membuat lathe berbentuk air mancur. Dalam program terdapat beberapa fungsi. Fungsi distance untuk menerapkan jarak pada bidang. Fungsi divisions untuk menentukan seberapa halus permukaan objek 3D yang dihasilkan serta transformasi dari bentuk awal ke bentuk whole hingga bentuk lathe penuh. Serta fungsi start,end,max angle yang memungkinkan untuk rotasi lathe di sudut tertentu. Fungsi capstart dan capend juga ditambahkan untuk mengatur bentuk ujung air mancur. Terdapat fungsi triangle untuk melihat bidang air mancur berupa kerangka/garis. User juga dapat switch mode antara normal,lit,texcoords.


## Applying Texture 3D

 Mengimplementasikan rendering 3D sederhana menggunakan WebGL untuk menggambar kubus dengan tekstur berupa sebuah foto dengan efek rotasi pada sumbu x y z. Program dibuat dengan menginisialisasi canvas dan konteks WebGL. Fungsi ini membuat program shader dari skrip yang ditentukan. Selain itu juga menetapkan lokasi atribut untuk posisi dan tekstur, serta matriks transformasi. Textures diambil dari URL image dan ditambahkan ke buffer setelah berhasil dimuat.

 ## Applying Lighting 3D

 Mengimplementasikan lighting pada cube 3D dengan webgl. Cube 3D berwarna hitam saat belum kena lighting. Lighting yang digunakan terdapat tiga warna yaitu merah, biru, dan ungu. Lighting ini mempunyai fungsi translasi sumbu x dan sumbu y yang memungkinkan lighting bergerak dari kiri ke kanan maupun atas bawa mengenai cube. Terdapat fungsi limit untuk mengatur besar kecil lighting yang mengenai cube.

 ## Animation (Rotation, Scale, Translation XYZ) 

 Mengimplementasikan animasi pada cube 3D dengan rendering webgl. Cube 3D yang dibuat memiliki warna berbeda di sisi-sisinya. Terdapat fungsi translasi X yang memungkinkan cube bergerak kiri-kanan, translasi Y yang memungkinkan kubus bergerak atas-bawah, dan translasi Z yang memungkinkan kubus bergerak sumbu z. Terdapat fungsi rotasi X,Y,Z yang membuat cube dapat berputar di sumbu X Y Z. Fungsi satu lagi adalah scalling untuk adjust ukuran kubus pada sumbu X Y Z.

## Ortographic & Perspective Camera

Menerapkan camera untuk melihat beberapa kubus yang ada. Camera dapat berfungsi untuk geser ke bagian kiri dan kanan (keyboard L untuk kiri dan R untuk kanan), bergerak maju mundur (keyboard F untuk maju dan B untuk mundur), roll ke samping kiri dan kanan (keyboard Y untuk roll kiri dan X untuk roll kanan), serta melihat dari POV atas bawah (arrow up and down). 

## Demo 3D


