namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(StatusCode);
        }

        private string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "Bad Request",
                401 => "Authorized, you are not",
                404 => "Resource Found, it was not",
                500 => "blah blah blah",
                _ => null,
            };
        }

        public int StatusCode { get; set; }

        public string Message { get; set; }
    }
}
