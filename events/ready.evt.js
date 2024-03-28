
async function presence(client) {
    return client.user?.setPresence({
      status: "online",
      activities: [
        {
          name: `discord.gg/`,
          type: 3,
        },
      ],
    });
  }
  export const data = {
    name: "ready",
    once: true,
  };
  /**
   *
   * @param {import("../bot.js").Bot} client
   */
  export async function execute(client) {
    await client.sleep(1000);
    console.log(`${client.user?.username} - (${client.user?.id})`);
    await presence(client);
    setInterval(presence, 10 * 60 * 1000, client);
    await client.handleCommands();
  }
  
