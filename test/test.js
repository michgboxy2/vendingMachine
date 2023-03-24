const request = require('supertest');
const chai	= require('chai');
const expect = chai.expect;
const app = require('../server/server');
const { natsWrapper } = require('../api/v1/utils/natsWrapper');

describe('/POST signup', async () => {
    it("fails if username is not passed", async () => {
        const data = { password: "password" }; 
        const res = await request(app).post('/api/v1/user').send(data);
    
        expect(res.status).equal(422);
    });

    it("fails if password is not passed", async () => {
        const data = { username: "username" }; 
        const res = await request(app).post('/api/v1/user/login').send(data);
    
        expect(res.status).equal(422);
    });

    it("successfully registers a user", async () => {
        const data = {
            username: 'king10',
            password: 'password',
            role: 'seller'
          };

          const response = await request(app)
          .post('/api/v1/user')
          .send(data);

        expect(response.status).equal(200);
        expect(response.body.username).equal(data.username);

    });

    it("fails to register a user if username already exists", async () => {
        const data = {
            username: 'king11',
            password: 'password',
            role: 'seller'
          };

          const response = await request(app)
          .post('/api/v1/user')
          .send(data);

          const response2 = await request(app)
          .post('/api/v1/user')
          .send(data);

          expect(response.status).equal(200);

          expect(response2.status).equal(400);
    });

    it("gets all users", async () => {
        const data = {
            username: 'king10',
            password: 'password',
            role: 'seller'
          };

          await request(app)
          .post('/api/v1/user')
          .send(data);

          const login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

          const response = await request(app)
          .get('/api/v1/user')
          .set('Authorization', `Bearer ${login.body.token}`)
          .send({});

          expect(response.status).equal(200);
          expect(response.body).to.have.property('users');

    });

    it("updates user successfully", async () => {
        const data = {
            username: 'king14',
            password: 'password',
            role: 'seller'
          };

          const data2 = {
            username: 'king15'
          };

          const user = await request(app)
          .post('/api/v1/user')
          .send(data);

          const login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

          const response = await request(app).patch(`/api/v1/user/${user.body.id}`)
          .set('Authorization', `Bearer ${login.body.token}`)
          .send(data2);

          expect(response.status).equal(200);
          expect(response.body.username).equal(data2.username);
    });

    it("deletes a user successfully", async () => {
        const data = {
            username: 'king14',
            password: 'password',
            role: 'seller'
          };


          const user = await request(app)
          .post('/api/v1/user')
          .send(data);

          const login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

        const response = await request(app).delete(`/api/v1/user/${user.body.id}`)
            .set('Authorization', `Bearer ${login.body.token}`)
            .send({});

            expect(response.status).equal(200);
    });
});


describe('/POST LOGIN', async () => {
    it("fails to login if username is not available", async () => {
        const data = { username: 'king' };

        const response = await request(app)
            .post('/api/v1/user/login')
            .send(data);

        expect(response.status).equal(422);
    });

    it("fails to login if password is not available", async () => {
        const data = { password: "password" };

        const response = await request(app)
                            .post('/api/v1/user/login')
                            .send(data);
        
        expect(response.status).equal(422);
    });

    it("logs in the user", async () => {
        const data = {
            username: 'king21',
            password: 'password',
            role: 'seller'
          };
    
          await request(app)
          .post('/api/v1/user')
          .send(data);
    
          const login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

          await request(app).post('/api/v1/user/logout/all').send({username: data.username, refreshToken: login.body.refreshToken});        
          expect(login.status).equal(200);
          expect(login.body).to.have.property('token');
          expect(login.body).to.have.property('refreshToken');
    });

    it("fails to login the user if the user attempt a second login", async () => {
        const data = {
            username: 'king22',
            password: 'password',
            role: 'seller'
          };
    
          await request(app)
          .post('/api/v1/user')
          .send(data);
    
          const login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

            const second_login = await request(app).post('/api/v1/user/login')
          .send({
              username: data.username,
              password: data.password
            });

            await request(app).post('/api/v1/user/logout/all').send({username: data.username, refreshToken: login.body.refreshToken});        
          
          expect(login.body).to.have.property('token');
          expect(login.body).to.have.property('refreshToken');
          expect(second_login.status).equal(403);
    });
});


describe('/deposit', async () => {
  before(async () => {
    await natsWrapper.connect(process.env.CLUSTER_ID, 'bcda', process.env.natHost);
  });

  after(async () => {
    await natsWrapper.client.close();
  });

it('fails to makes a deposit if user is a seller', async () => {
    const depositData = {deposit: 20};

    const data = {
        username: 'king29',
        password: 'password',
        role: 'seller'
      };

    const user = await request(app)
      .post('/api/v1/user')
      .send(data);

      const login = await request(app).post('/api/v1/user/login')
      .send({
          username: data.username,
          password: data.password
        });


    const response = await request(app).post('/api/v1/deposit')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(depositData);
        expect(response.status).equal(401);
  
});

it('successfully makes a deposit if user is a buyer', async () => {
    const depositData = {deposit: 20};

    const data = {
        username: 'king49',
        password: 'password',
        role: 'buyer'
      };

    const user = await request(app)
      .post('/api/v1/user')
      .send(data);

      const login = await request(app).post('/api/v1/user/login')
      .send({
          username: data.username,
          password: data.password
        });


    const response = await request(app).post('/api/v1/deposit')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(depositData);

        expect(response.status).equal(200);
        expect(response.body).to.have.property('deposit');
        expect(response.body.deposit).equal(depositData.deposit);
});



});

describe('/buy', async () => {
  before(async () => {
    await natsWrapper.connect(process.env.CLUSTER_ID, 'buy', process.env.natHost);
  });

  after(async () => {
    await natsWrapper.client.close();
  });


  it('fails if you are not a buyer', async () => {
    const depositData = {deposit: 20};

    const data = {
        username: 'king31',
        password: 'password',
        role: 'seller'
      };

    const productData = {
      productName: "coke",
      amountAvailable: 3,
      cost: 10,
    };

    const user = await request(app)
      .post('/api/v1/user')
      .send(data);

      
    const login = await request(app).post('/api/v1/user/login')
      .send({
          username: data.username,
          password: data.password
        });

    
    const product = await request(app).post('/api/v1/product')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(productData);




    const response = await request(app).post('/api/v1/buy')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({
          productId: product.body.id,
          quantity: 2
        });

        expect(response.status).equal(401);
  });

  it("fails if you  don't have enough balance", async () => {
    const depositData = {deposit: 20};

    const userdata1 = {
        username: 'king33',
        password: 'password',
        role: 'seller'
      };

      const userdata2 = {
        username: 'king34',
        password: 'password',
        role: 'buyer'
      };

    const productData = {
      productName: "pepsi",
      amountAvailable: 3,
      cost: 10,
    };

    const user1 = await request(app)
      .post('/api/v1/user')
      .send(userdata1);

      const user2 = await request(app)
      .post('/api/v1/user')
      .send(userdata2);

      
    const loginUser1 = await request(app).post('/api/v1/user/login')
      .send({
          username: userdata1.username,
          password: userdata1.password
        });

    const loginUser2 = await request(app).post('/api/v1/user/login')
      .send({
          username: userdata2.username,
          password: userdata2.password
        });

    
    const product = await request(app).post('/api/v1/product')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(productData);

    await request(app).post('/api/v1/deposit')
    .set('Authorization', `Bearer ${loginUser2.body.token}`)
    .send(depositData);




    const response = await request(app).post('/api/v1/buy')
        .set('Authorization', `Bearer ${loginUser2.body.token}`)
        .send({
          productId: product.body.id,
          quantity: 3
        });

      expect(response.status).equal(400);
  });

  it('makes a successful purchase if you are buyer with enough balance', async () => {
    const depositData = { deposit: 100 };

    const userdata1 = {
        username: 'king35',
        password: 'password',
        role: 'seller'
      };

      const userdata2 = {
        username: 'king36',
        password: 'password',
        role: 'buyer'
      };

    const productData = {
      productName: "malta",
      amountAvailable: 3,
      cost: 10,
    };

    const user1 = await request(app)
      .post('/api/v1/user')
      .send(userdata1);

      const user2 = await request(app)
      .post('/api/v1/user')
      .send(userdata2);

      
    const loginUser1 = await request(app).post('/api/v1/user/login')
      .send({
          username: userdata1.username,
          password: userdata1.password
        });

    const loginUser2 = await request(app).post('/api/v1/user/login')
      .send({
          username: userdata2.username,
          password: userdata2.password
        });

    
    const product = await request(app).post('/api/v1/product')
        .set('Authorization', `Bearer ${loginUser1.body.token}`)
        .send(productData);

    await request(app).post('/api/v1/deposit')
    .set('Authorization', `Bearer ${loginUser2.body.token}`)
    .send(depositData);




    const response = await request(app).post('/api/v1/buy')
        .set('Authorization', `Bearer ${loginUser2.body.token}`)
        .send({
          productId: product.body.id,
          quantity: 3
        });

      expect(response.status).equal(200);
      expect(response.body.totalSpent).equal(30);
      expect(response.body).to.have.property("totalSpent");
      expect(response.body).to.have.property("product");
      expect(response.body).to.have.property("change");
  });
  });
