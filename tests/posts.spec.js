import {test,expect} from '@playwright/test'

async function attachResponse(testInfo,name,response,body,responseTime){
    await testInfo.attach(name,{
        body: JSON.stringify({
            status: response.status(),
            responseTime: responseTime + " ms ",
            headers: response.headers(),
            responseBody: body
        },null,2),
        contentType: 'application/json'
    });
}

test.describe('Firstserve_API_Automation', ()=>{

    const startTime = Date.now();
    const endTime = Date.now();
    const responseTime = endTime - startTime;


test('Get all posts', async ({request},testInfo)=>{
  
    
    const response = await request.get('/posts');
    
    

   // console.log(response.status);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    // Validate response time
    expect(endTime - startTime).toBeLessThan(2000);

    // Validate headers
    expect(response.headers()['content-type']).toContain('application/json');

    await  attachResponse(testInfo,"Get /post",response,body,responseTime);

    // Validate data types
    const post = body[0];
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
    expect(typeof post.userId).toBe('number');
  });


  // ===============================
  // GET SINGLE POST
  // ===============================
  test('GET /posts/1 - should return single post', async ({ request },testInfo) => {
 
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
     await  attachResponse(testInfo,"Get /post/1",response,body,responseTime);
  });


  // ===============================
  // QUERY PARAM TEST
  // ===============================
  test('GET /posts?userId=1 - should filter posts', async ({ request },testInfo) => {
  
    const response = await request.get('/posts?userId=1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    body.forEach(post => {
      expect(post.userId).toBe(1);
    });
    await  attachResponse(testInfo,"Get /post userid 1",response,body,responseTime);
  });


  // ===============================
  // CREATE POST
  // ===============================
  test('POST /posts - create new post', async ({ request },testInfo) => {
  
    const response = await request.post('/posts', {
      data: {
        title: "Test Title",
        body: "Test Body",
        userId: 1
      }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe("Test Title");
    await  attachResponse(testInfo,"Create /post",response,body,responseTime);
  });


  // ===============================
  // UPDATE POST
  // ===============================
  test('PUT /posts/1 - update post', async ({ request },testInfo) => {
  
    const response = await request.put('/posts/1', {
      data: {
        id: 1,
        title: "Updated Title",
        body: "Updated Body",
        userId: 1
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe("Updated Title");
    await  attachResponse(testInfo,"Update /post",response,body,responseTime);
  });


  // ===============================
  // DELETE POST
  // ===============================
  test('DELETE /posts/1 - delete post', async ({ request },testInfo) => {
  
    const response = await request.delete('/posts/1');
    expect([200, 204]).toContain(response.status());
    
    let body = null;
    
    if(response.status()!==204){
        body = await response.json();
}

    await  attachResponse(testInfo,"Delete /post",response,body,responseTime);
  });


  // ===============================
  // ERROR HANDLING - NON EXISTENT
  // ===============================
  test('GET non-existent post', async ({ request },testInfo) => {
 
    const response = await request.get('/posts/999999');
    expect(response.status()).toBe(404);
    const body = await response.text();
    await   attachResponse(testInfo,"Get non-existent /post",response,body,responseTime);
  });


  // ===============================
  // INVALID DATA TEST
  // ===============================
  test('POST invalid data', async ({ request },testInfo) => {
  
    const response = await request.post('/posts', {
      data: {
        title: 12345  // invalid type
      }
    });

    // JSONPlaceholder still returns 201
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(typeof body.title).toBe('number');
    await  attachResponse(testInfo,"POST Invalid /post",response,body,responseTime);
  });
    
    
    
})




