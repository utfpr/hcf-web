FROM alpine:3.9


RUN apk update && \
    apk add --no-cache certbot && \
    rm -rf /var/cache/apk/*

COPY request-cert.sh /

RUN chown root:root /etc/crontabs/root \
    && echo "45 2 * * 6 /bin/sh /usr/bin/certbot renew" > /etc/crontabs/root


ENTRYPOINT [ "/usr/sbin/crond", "-f" ]

