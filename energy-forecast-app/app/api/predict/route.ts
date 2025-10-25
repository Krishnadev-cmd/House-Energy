export async function POST(request: Request) {
    const { data } = await request.json();
    console.log('Request data:', data);
    const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 
                           'https://xw4u71iygc.execute-api.ap-south-1.amazonaws.com/prod/predict';
    
    console.log('Calling API Gateway:', API_GATEWAY_URL);
    
    try {
        const response = await fetch(API_GATEWAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);
        
        if (!response.ok) {
            return Response.json({
                success: false,
                error: `API Gateway error (${response.status})`,
                details: responseText
            }, { status: response.status });
        }
        
        // Parse the outer response
        const outerResult = JSON.parse(responseText);
        
        // Lambda returns a response with statusCode, headers, and body
        // The actual data is in the 'body' field as a string
        let actualData;
        
        if (outerResult.body) {
            // Parse the inner body string
            actualData = JSON.parse(outerResult.body);
        } else {
            // Direct response format
            actualData = outerResult;
        }
        
        console.log('Parsed data:', actualData);
        
        return Response.json({
            success: true,
            prediction: actualData
        });
        
    } catch (error: any) {
        console.error('Error:', error);
        return Response.json(
            { 
                success: false, 
                error: 'Prediction failed',
                message: error.message || 'Unknown error',
                details: error.toString()
            },
            { status: 500 }
        );
    }
}