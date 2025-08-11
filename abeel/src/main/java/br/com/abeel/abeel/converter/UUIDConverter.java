package br.com.abeel.abeel.converter;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.util.UUID;

public class UUIDConverter {

    public static byte[] toBytes(UUID uuid){
        ByteBuffer buffer = ByteBuffer.wrap(new byte[16]);
        buffer.putLong(uuid.getMostSignificantBits());
        buffer.putLong(uuid.getLeastSignificantBits());
        return buffer.array();
    }

    public static UUID fromBytes(byte[] bytes){
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        long most = bb.getLong();
        long least = bb.getLong();
        return new UUID(most, least);
    }

}
