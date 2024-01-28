using Common.Context;
using Common.Services;

namespace GameBoardOnlineApi.GraphQl.Types;

public class UserType : ObjectType<User>
{
    protected override void Configure(IObjectTypeDescriptor<User> descriptor)
    {
        base.Configure(descriptor);

        descriptor.Field(u => u.Id).IsProjected();
        descriptor.Field(u => u.Name).IsProjected();
        
        descriptor.Field(u => u.Players).Ignore();
        descriptor.Field(u => u.ChatMessages).Ignore();

        // TODO Security
        descriptor
            .Field("token")
            .Resolve(context => context.Services.GetRequiredService<UserService>().Login(context.Parent<User>().Id));
    }
}