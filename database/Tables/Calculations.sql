-- Calculations table: Store calculation history
CREATE TABLE [dbo].[Calculations] (
    [CalculationID] int IDENTITY(1,1) PRIMARY KEY,
    [UserID] int FOREIGN KEY REFERENCES Users(UserID),
    [Expression] nvarchar(100) NOT NULL,      -- "5 + 3"
    [Result] decimal(18,2) NOT NULL,          -- 8.00
    [CalculationDate] datetime2 DEFAULT GETDATE()
);