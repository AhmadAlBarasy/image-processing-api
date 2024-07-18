import request from "supertest";
import app from "../src/app";


/*-------------- invalid API endpoint tests --------------*/

describe("send a HTTP request to an endpoint that is not implemented", () => {
  test("send a GET request to '/home", async () => {
    const res = await request(app).get("/home");
    expect(res.body.status).toEqual('fail');
    expect(res.status).toBe(404);
  });
});


/*-------------- root API endpoint tests --------------*/

// happy case
describe("get a list of all the files in the 'public' directory", () => {
  test("send a GET request to '/api'", async () => {
    const res = await request(app).get("/api");
    expect(res.body.status).toEqual('success');
  });
});

// invalid http method case
describe("send a POST request to '/api'", () => {
    test("send a POST request to '/api'", async () => {
      const res = await request(app).post("/api");
      expect(res.body.status).toEqual('fail');
      expect(res.status).toBe(405);
    });
  });

/*-------------- upload API endpoint tests --------------*/

// happy case
describe('send a POST request with an image attached with a supported fromat (PNG, JPEG)', () => {
  it('should return a 200 status code response indicating that the image got uploaded successfully', async () => {
    const res = await request(app).post('/api/upload').attach('image', './tests/tap.png');
    expect(res.status).toBe(201);
    expect(res.body.status).toEqual('success');
  });
});

// unspported file format case
// describe('send a POST request with an image attached with a format that is not supported (JFIF)', () => {
//   it('should return a 400 bad request response indicating that the file type is not supported', async () => {
//     const res = await request(app).post('/api/upload').attach('image', './tests/cat-pointer.jfif');
//     expect(res.status).toBe(400);
//     expect(res.body.status).toEqual('fail');
//   });
// });

/*-------------- download API endpoint tests --------------*/

// happy case
describe('Download image', () => {
  it('should retrive an image from server using it\'s name', async () => {
    const res = await request(app).get('/api/download?fileName=tap.png');
    expect(res.status).toBe(200);
  });
});

// non-existing image case
describe('Download non-existent image', () => {
    it('should return a 404 not found response', async () => {
      const res = await request(app).get('/api/download?fileName=tap.gif');
      expect(res.status).toBe(404);
    });
});

// invalid fileName case
describe('Request an image with an invalid fileName', () => {
    it('should return a 400 bad request response', async () => {
      const res = await request(app).get('/api/download?fileName=ta*p.png');
      expect(res.status).toBe(400);
    });
});

/*-------------- crop API endpoint tests --------------*/

//happy case
describe('send a POST request to Crop an image using valid crop dimensions', () => {
  it('should return a 200 status code resopnse with the new dimensions included in the response body', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.png', newName: 'out.png', left: 250, top: 250, width: 250, height: 250});
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.newDimensions).toEqual({width: 250, height: 250});
  });
});

//missing data required case
describe('send a POST request to Crop an image using valid crop dimensions with missing ones', () => {
  it('should return a 400 bad request resopnse with a message that prompts to check API docs', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.png', newName: 'out.png', top: 250, width: 250, height: 250}); // missing left
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

// invalid crop dimensions case
describe('send a POST request to Crop an image using invalid crop dimensions', () => {
  it('should return a 400 bad request resopnse with a message that says that the crop dimensions is invalid', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.png', newName: 'out.png', top: 250, left: 300, width: 250, height: 250}); // left + width = 350 > 500 (original photo widht)
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

// invalid crop dimensions case
describe('send a POST request to Crop an image using invalid crop dimensions', () => {
  it('should return a 400 bad request resopnse with a message that says that the crop dimensions is invalid', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.png', newName: 'out.png', top: 250, left: 300, width: 250, height: 250}); // left + width = 350 > 500 (original photo width)
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

// non-existing file case
describe('send a POST request to Crop an image that doesn\'t exist', () => {
  it('should return a 400 bad request resopnse with a message that says that the file is not found', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.gif', newName: 'out.png', top: 250, left: 250, width: 250, height: 250});
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual("fail");
  });
});

// invalid output file name case
describe('send a POST request to Crop an image and providing an invalid name for the output file', () => {
  it('should return a 400 bad request resopnse with a message that says that the fileName is invalid', async () => {
    const res = await request(app).post('/api/crop').send({fileName: 'tap.png', newName: 'outpng', top: 250, left: 250, width: 250, height: 250});
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

/*-------------- blur API endpoint tests --------------*/

//happy case
describe('send a POST request to blur an image using valid fileName and sigma value', () => {
  it('should return a 200 status code resopnse with the new dimensions included in the response body', async () => {
    const res = await request(app).post('/api/blur').send({fileName: 'tap.png', newName: 'out.png', sigma: 15});
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
  });
});

//invalid sigma value case
describe('send a POST request to blur an image using invalid sigma value: sigma > 1000 or sigma < 0.3', () => {
  it('should return a 400 bad request resopnse with a message that says you should provide a valid sigma value', async () => {
    const res = await request(app).post('/api/blur').send({fileName: 'tap.png', newName: 'out.png', sigma: 3000});
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

/*-------------- resize API endpoint tests --------------*/

//happy case 1 (not respecting the aspect ratio)
describe('send a POST request to resize an image using valid fileName and valid resize dimensions', () => {
  it('should return a 200 status code resopnse with the new dimensions included in the response body', async () => {
    const res = await request(app).post('/api/resize').send({fileName: 'tap.png', newName: 'out.png', width: 500, height: 800, respectAspectRatio: false});
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.newDimensions).toEqual({width: 500, height: 800});
  });
});

//happy case 2 (respecting the aspect ratio)
describe('send a POST request to resize an image using valid fileName and valid resize dimensions', () => {
  it('should return a 200 status code resopnse with the new dimensions included in the response body', async () => {
    const res = await request(app).post('/api/resize').send({fileName: 'tap.png', newName: 'out.png', width: 1200, height: 1000, respectAspectRatio: true});
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("success");
    expect(res.body.newDimensions).toEqual({width: 1000, height: 1000});
  });
});

// invalid dimensions case
describe('send a POST request to resize an image using invalid resize dimensions', () => {
  it('should return a 400 bad request resopnse with a message that says the dimensions is invalid', async () => {
    const res = await request(app).post('/api/resize').send({fileName: 'tap.png', newName: 'out.png', width: -20, height: 500, respectAspectRatio: true});
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual("fail");
  });
});

/*-------------- delete API endpoint tests --------------*/

// happy case
describe('Delete an image that exists on the server using it\'s name', () => {
  it('should return a 204 no content response indicating successfull deletion of the image', async () => {
    const res = await request(app).delete('/api/delete?fileName=out.png');
    expect(res.status).toBe(204);
  });
});

// image doesn't exist case
describe('Attempting to delete an image that does not exist on the server', () => {
  it('returns a 404 not found reponse with a message that says file not found', async () => {
    const res = await request(app).delete('/api/delete?fileName=myPhoto.png');
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('fail');
  });
});