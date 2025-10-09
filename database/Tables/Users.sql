-- Users table: Simple user tracking for demo
CREATE TABLE [dbo].[Users] (
    [UserID] int IDENTITY(1,1) PRIMARY KEY,
    [SessionID] nvarchar(255) UNIQUE NOT NULL,
    [CreatedDate] datetime2 DEFAULT GETDATE()
);