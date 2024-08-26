<h1>How to run project?</h1>

<ol>
  <li>
    Đảm bảo đăng ký các service:
    <ul>
      <li>
        Gmail của google dùng để gửi mail
      </li>
      <li>
        Dịch vụ lưu trữ cloud của Cloudinary
      </li>
      <li>
        Tạo database
      </li>
    </ul>
  </li>
  <li>
    Hệ thống cần các config trong thư mục config bao gồm
    <ul>
      <li>
        cloudinary.config.js:
        <ul>
          <li>
            cloud_name: tên cloud đăng ký trên cloudinary
          </li>
          <li>
            api_key: api key
          </li>
          <li>
            api_secret: secret key
          </li>
        </ul>
      </li>
      <li>
        db.config.js
        <ul>
          <li>
            host: tên host của database
          </li>
          <li>
            user: tên user
          </li>
          <li>
            password: mật khẩu
          </li>
          <li>
            database: tên database
          </li>
          <li>
            port: công truy cập database
          </li>
        </ul>
      </li>
      <li>
        googleService.config.js:
        <ul>
          <li>
            clientId
          </li>
          <li>
            clientSecret
          </li>
          <li>
            refresh_token
          </li>
        </ul>
      </li>
    </ul>
  </li>

  <li>
    Thêm các file log để ghi log của hệ thống. Trong thư mục src/api thêm thư mục logs và tạo các file: <b>err.log</b> và <b>infor.log</b>
  </li>

  <li>
    Dùng lệnh: <i><b>npm install</b></i> để cài đặt các package cần thiết.
  </li>

  <li>
    Dùng lệnh <i><b>npm start</b></i> để khởi chạy.
  </li>

  <li>
    Dùng file RAP_AI.postman_collection.json import vào POSTMAN để gọi các API
  </li>
  
</ol>
