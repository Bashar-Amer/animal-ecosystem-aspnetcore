namespace WebApp.DTOs
{
    public class Result<T>
    {
        public bool IsSuccess { get; private set; }
        public T? Data { get; private set; }
        public string? ErrorMessage { get; private set; }
        public string? RedirectUrl { get; private set; }

        public static Result<T> Success(T data, string? redirectUrl = null) =>
            new() { IsSuccess = true, Data = data, RedirectUrl = redirectUrl };

        public static Result<T> Failure(string errorMessage) =>
            new() { IsSuccess = false, ErrorMessage = errorMessage };
    }

    // Non-generic version for actions that don't return data
    public class Result
    {
        public bool IsSuccess { get; private set; }
        public string? ErrorMessage { get; private set; }
        public string? RedirectUrl { get; private set; }

        public static Result Success(string? redirectUrl = null) =>
            new() { IsSuccess = true, RedirectUrl = redirectUrl };

        public static Result Failure(string errorMessage) =>
            new() { IsSuccess = false, ErrorMessage = errorMessage };
    }
}
